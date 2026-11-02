import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { filesWithin, sizeFiles, byteSizes, routePath } from './output-utils.mjs';

export async function measureAssets(root) {
  const files = await filesWithin(root);
  const routes = [];
  const cache = new Map();
  const sizes = (paths) => sizeFiles(root, paths, cache);
  let home;
  for (const file of files.filter((file) => file.endsWith('.html'))) {
    const data = await readFile(resolve(root, file));
    const page = new JSDOM(data.toString()).window.document;
    const scriptTags = [...page.querySelectorAll('script[src], link[rel="preload"][as="script"], link[rel="modulepreload"]')];
    const scriptPath = (tag) => tag.getAttribute('src') || tag.getAttribute('href');
    const scripts = scriptTags.filter((tag) => !tag.hasAttribute('nomodule')).map(scriptPath).filter((path) => path.startsWith('/'));
    const nomoduleScripts = scriptTags.filter((tag) => tag.hasAttribute('nomodule')).map(scriptPath).filter((path) => path.startsWith('/'));
    const css = [...page.querySelectorAll('link[rel="stylesheet"]')].map((tag) => tag.getAttribute('href')).filter((path) => path.startsWith('/'));
    const inlineScriptRaw = [...page.querySelectorAll('script:not([src])')].reduce((n, tag) => n + Buffer.byteLength(tag.textContent), 0);
    const route = { path: routePath(file), html: byteSizes(data), javascript: await sizes(scripts), nomoduleJavaScript: await sizes(nomoduleScripts), allScriptTags: await sizes([...scripts, ...nomoduleScripts]), css: await sizes(css), inlineScriptRaw };
    routes.push(route);
    if (file === 'index.html') home = { page, route };
  }
  if (!home) throw new Error('Exported homepage missing');
  const fonts = await sizes(files.filter((f) => /\.(woff2?)$/.test(f)).map((f) => `/${f}`));
  const images = await sizes(files.filter((f) => /\.(avif|webp|png|jpe?g|svg)$/.test(f)).map((f) => `/${f}`));
  // Conservatively include every homepage picture, even lazy images below fold.
  // At 390px choose each picture's first eligible AVIF source; otherwise its img.
  const mobilePaths = [];
  for (const picture of home.page.querySelectorAll('picture')) {
    const source = [...picture.querySelectorAll('source')].find((s) => s.type === 'image/avif' && (!s.media || /max-width:\s*767px/.test(s.media)));
    mobilePaths.push((source?.getAttribute('srcset') || picture.querySelector('img')?.getAttribute('src'))?.split(/[,\s]/)[0]);
  }
  for (const img of home.page.querySelectorAll('img')) if (!img.closest('picture')) mobilePaths.push(img.getAttribute('src'));
  const mobileImages = await sizes(mobilePaths.filter(Boolean));
  const hero = mobileImages.files.find((f) => /city-mobile/.test(f.path));
  const totalGzip = home.route.html.gzip + home.route.javascript.gzip + home.route.css.gzip + fonts.raw + mobileImages.raw;
  return {
    generatedAt: new Date().toISOString(), unit: 'bytes (budgets use decimal KB)',
    methodology: 'Per-file gzip level9 and Brotli quality6 estimates, not HTTP observations. Initial JS = unique external scripts/preloaded scripts in route HTML for modern module-capable browsers, including framework. nomoduleJavaScript reports skipped legacy polyfills separately; allScriptTags reports their conservative union (not all fetched by modern browsers). Inline RSC/bootstrap counted in compressed HTML, not counted twice as JS. Mobile estimate = gzip HTML+modern initial JS+CSS plus raw WOFF2 and mobile AVIF for every homepage picture (including lazy below-fold images); conservative 390px estimate, not measured viewport transfer. Decorative async chunks excluded from initial scripts; all emitted JS separately reported.',
    routes, fonts, images,
    allEmittedJavaScript: await sizes(files.filter((f) => f.endsWith('.js')).map((f) => `/${f}`)),
    mobileEstimate: { imageRaw: mobileImages.raw, images: mobileImages.files, fontRaw: fonts.raw, totalGzip },
    budgets: { initialJavaScript: { limit: 150000, maximumGzip: Math.max(...routes.map((r) => r.javascript.gzip)), pass: routes.every((r) => r.javascript.gzip <= 150000) }, mobileHero: { limit: 200000, raw: hero?.raw ?? null, pass: Boolean(hero && hero.raw <= 200000) }, mobileAboveFoldConservative: { limit: 750000, bytes: totalGzip, pass: totalGzip <= 750000 } },
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(await measureAssets(resolve(process.argv[2] || 'out')), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
