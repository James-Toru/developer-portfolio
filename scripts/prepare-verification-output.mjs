import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { isAbsolute, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { filesWithin } from './output-utils.mjs';

// A disposable verification snapshot, never a deployable replacement for Next.
export async function prepareVerificationOutput(root = process.cwd()) {
  root = resolve(root);
  const source = resolve(root, '.next/server/app');
  const htmlFiles = (await filesWithin(source)).filter((file) => file.endsWith('.html'));
  if (!htmlFiles.includes('index.html') || !htmlFiles.includes('_not-found.html')) throw new Error('Build is missing prerendered homepage or 404 HTML; run next build first.');
  const output = resolve(root, 'out');
  const within = relative(root, output);
  if (!within || within.startsWith('..') || isAbsolute(within)) throw new Error('Unsafe verification output directory');
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(resolve(root, 'public'), output, { recursive: true });
  await cp(resolve(root, '.next/static'), resolve(output, '_next/static'), { recursive: true });
  for (const file of htmlFiles) {
    if (file.split('/').some((segment) => segment.startsWith('_')) && file !== '_not-found.html') continue;
    const paths = file === '_not-found.html' ? ['404.html', '404/index.html'] : [file === 'index.html' ? file : `${file.slice(0, -5)}/index.html`];
    for (const path of paths) {
      const target = resolve(output, path);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, await readFile(resolve(source, file)));
    }
  }
  return { htmlPages: htmlFiles.filter((file) => !file.startsWith('_')).length + 2 };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log('Prepared fresh Next.js verification snapshot:', await prepareVerificationOutput()); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
