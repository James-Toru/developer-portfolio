import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, readFile, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { checkStaticOutput } from './check-static-output.mjs';
import { measureAssets } from './measure-assets.mjs';
import { staticResponse } from './preview-static.mjs';
import { prepareVerificationOutput } from './prepare-verification-output.mjs';

test('server snapshot replaces stale output, maps prerendered routes and excludes server code', async () => {
  const root = await mkdtemp(join(tmpdir(), 'portfolio-build-'));
  try {
    for (const dir of ['.next/server/app/work', '.next/server/app/api/contact', '.next/static/chunks', 'public', 'out']) await mkdir(join(root, dir), { recursive: true });
    for (const [file, content] of Object.entries({ '.next/server/app/index.html': 'fresh home', '.next/server/app/work.html': 'archive', '.next/server/app/work/example.html': 'project', '.next/server/app/_not-found.html': 'missing', '.next/server/app/_global-error.html': 'internal', '.next/server/app/api/contact/route.js': 'server secret', '.next/server/app/work/example.rsc': 'server data', '.next/static/chunks/client.js': 'client', 'public/cv.pdf': 'cv', 'out/stale.html': 'stale' })) await writeFile(join(root, file), content);
    await prepareVerificationOutput(root);
    for (const [file, expected] of Object.entries({ 'index.html': 'fresh home', 'work/index.html': 'archive', 'work/example/index.html': 'project', '404.html': 'missing', '404/index.html': 'missing', '_next/static/chunks/client.js': 'client', 'cv.pdf': 'cv' })) assert.equal(await readFile(join(root, 'out', file), 'utf8'), expected);
    for (const file of ['stale.html', '_global-error.html', 'api/contact/route.js', 'work/example.rsc']) await assert.rejects(access(join(root, 'out', file)));
  } finally { await rm(root, { recursive: true, force: true }); }
});

const records = [{ slug: 'example', title: 'Example', summary: 'Actual work.' }];
const html = (body) => `<html lang="en"><head><title>Portfolio</title></head><body><main id="main-content"><h1>Example</h1>${body}<a href="mailto:gatorumbugua@gmail.com">Contact</a></main></body></html>`;
async function fixture(run) {
  const root = await mkdtemp(join(tmpdir(), 'portfolio-verification-'));
  try {
    await mkdir(join(root, 'work/example'), { recursive: true });
    await writeFile(join(root, 'index.html'), html('<a href="/work/">Work</a>'));
    await writeFile(join(root, '404.html'), html('Page not found <a href="/">Home</a>'));
    await writeFile(join(root, 'work/index.html'), html('<a href="/work/example/">Example</a>'));
    await writeFile(join(root, 'work/example/index.html'), html('Actual work. <a href="/work/">Back to work</a>'));
    await run(root);
  } finally { await rm(root, { recursive: true, force: true }); }
}

test('static checker accepts complete export then rejects missing routes and changed required content', () => fixture(async (root) => {
  assert.deepEqual((await checkStaticOutput(root, records)).errors, []);
  await writeFile(join(root, '404.html'), '<html lang="en"><title>Not found</title><main><h1>Page not found</h1><a href="/">Home</a></main></html>');
  assert.deepEqual((await checkStaticOutput(root, records)).errors, []);
  await writeFile(join(root, 'work/example/index.html'), html('Wrong content.'));
  assert.match((await checkStaticOutput(root, records)).errors.join('\n'), /summary/);
  await rm(join(root, 'work/example/index.html'));
  assert.match((await checkStaticOutput(root, records)).errors.join('\n'), /missing.*example/i);
}));

test('static checker catches broken fragments, CSS resources and unsupported website actions', () => fixture(async (root) => {
  await writeFile(join(root, 'index.html'), html('<a href="/work/#absent">Work</a><link rel="stylesheet" href="/site.css"><a href="https://invented.example">Visit website</a>'));
  await writeFile(join(root, 'site.css'), 'body { background: url("/missing.webp"); }');
  const result = await checkStaticOutput(root, records);
  assert.match(result.errors.join('\n'), /fragment.*absent/);
  assert.match(result.errors.join('\n'), /missing.webp/);
  assert.match(result.errors.join('\n'), /unsupported.*website/i);
}));

test('asset report deduplicates route scripts and includes inline payload, fonts and mobile art', () => fixture(async (root) => {
  await mkdir(join(root, 'fonts'));
  await mkdir(join(root, 'art'));
  await writeFile(join(root, 'app.js'), 'const example = 1;'.repeat(50));
  await writeFile(join(root, 'legacy.js'), 'var legacy = true;');
  await writeFile(join(root, 'style.css'), "@font-face { src:url('/fonts/test.woff2'); }");
  await writeFile(join(root, 'fonts/test.woff2'), Buffer.alloc(12));
  await writeFile(join(root, 'art/city-mobile.avif'), Buffer.alloc(40));
  await writeFile(join(root, 'index.html'), html('<script src="/app.js"></script><script src="/app.js"></script><script nomodule src="/legacy.js"></script><script>const inline = 1;</script><link rel="stylesheet" href="/style.css"><picture><source media="(max-width:767px)" type="image/avif" srcset="/art/city-mobile.avif"><img src="/desktop.webp"></picture>'));
  const report = await measureAssets(root);
  const home = report.routes.find((route) => route.path === '/');
  assert.equal(home.javascript.files.length, 1);
  assert.equal(home.javascript.raw, 900);
  assert.equal(home.nomoduleJavaScript.raw, 18);
  assert.equal(home.allScriptTags.raw, 918);
  assert.equal(home.inlineScriptRaw, 17);
  assert.equal(report.mobileEstimate.imageRaw, 40);
  assert.equal(report.mobileEstimate.fontRaw, 12);
  assert.ok(report.mobileEstimate.totalGzip > home.javascript.gzip + 52);
}));

test('preview uses exported 404, denies traversal and never exposes files outside the export', () => fixture(async (root) => {
  const page = await staticResponse(root, '/work/example/', 'GET', 'gzip');
  assert.equal(page.status, 200);
  assert.equal(page.headers['Content-Encoding'], 'gzip');
  assert.match(gunzipSync(page.body).toString(), /Actual work/);
  assert.equal((await staticResponse(root, '/', 'GET', 'gzip;q=0')).headers['Content-Encoding'], undefined);
  assert.equal((await staticResponse(root, '/', 'GET', 'gzip;q=0.5')).headers['Content-Encoding'], 'gzip');
  const missing = await staticResponse(root, '/does-not-exist/', 'GET', '');
  assert.equal(missing.status, 404);
  assert.match(missing.body.toString(), /Page not found/);
  for (const path of ['/../README.md', '/%2e%2e/README.md', '/%5c..%5cREADME.md', '/%00']) {
    assert.equal((await staticResponse(root, path, 'GET', '')).status, 400, path);
  }
  assert.equal((await staticResponse(root, '/', 'POST', '')).status, 405);
  assert.equal((await staticResponse(root, '/work/', 'HEAD', '')).body.length, 0);
}));
