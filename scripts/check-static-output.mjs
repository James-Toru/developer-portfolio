import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { filesWithin, outputPath, routePath } from './output-utils.mjs';

export async function checkStaticOutput(root, records, email = 'gatorumbugua@gmail.com') {
  const files = await filesWithin(root);
  const pages = new Map();
  const errors = [];
  for (const file of files.filter((file) => file.endsWith('.html'))) {
    pages.set(file, new JSDOM(await readFile(resolve(root, file), 'utf8')).window.document);
  }
  const required = ['index.html', 'work/index.html', '404.html', ...records.map((p) => `work/${p.slug}/index.html`)];
  for (const file of required) if (!pages.has(file)) errors.push(`Missing required page: ${file}`);
  const archive = pages.get('work/index.html');
  for (const project of records) {
    const file = `work/${project.slug}/index.html`;
    const page = pages.get(file);
    if (!archive?.querySelector(`a[href="/work/${project.slug}/"]`)?.textContent.includes(project.title)) errors.push(`Archive missing title/link: ${project.slug}`);
    if (!page) continue;
    if (page.querySelector('h1')?.textContent !== project.title) errors.push(`Wrong project heading: ${file}`);
    if (!page.querySelector('main')?.textContent.includes(project.summary)) errors.push(`Missing project summary: ${file}`);
    for (const href of [project.repository, project.demo].filter(Boolean)) {
      if (![...page.querySelectorAll('a[href]')].some((a) => a.getAttribute('href') === href)) errors.push(`Missing source-backed action ${href}: ${file}`);
    }
  }
  async function checkReference(value, source, fragment = false) {
    if (!value || /^(data:|mailto:|tel:)/i.test(value)) return;
    let url;
    try { url = new URL(value, `https://portfolio.test${source}`); } catch { errors.push(`Malformed link ${value}: ${source}`); return; }
    if (url.origin !== 'https://portfolio.test') return;
    const file = url.pathname.endsWith('/') ? `${url.pathname.slice(1)}index.html` : url.pathname.slice(1);
    try {
      if (!(await stat(outputPath(root, `/${file}`))).isFile()) throw new Error();
    } catch { errors.push(`Unresolved internal resource ${value}: ${source}`); return; }
    if (fragment && url.hash && pages.has(file)) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (!pages.get(file).getElementById(id)) errors.push(`Unresolved fragment ${id}: ${source} -> ${value}`);
    }
  }
  const verifiedDemos = new Set(records.map((p) => p.demo).filter(Boolean));
  for (const [file, page] of pages) {
    const route = routePath(file);
    if (page.querySelectorAll('h1').length !== 1 || !page.querySelector('main') || !page.title || page.documentElement.lang !== 'en') errors.push(`Missing semantic page structure: ${file}`);
    if (required.includes(file) && file !== '404.html' && !page.querySelector(`a[href="mailto:${email}"]`)) errors.push(`Missing confirmed contact: ${file}`);
    for (const element of page.querySelectorAll('[href], [src], [srcset]')) {
      if (element.hasAttribute('href')) await checkReference(element.getAttribute('href'), route, true);
      if (element.hasAttribute('src')) await checkReference(element.getAttribute('src'), route);
      if (element.hasAttribute('srcset')) for (const item of element.getAttribute('srcset').split(',')) await checkReference(item.trim().split(/\s+/)[0], route);
      if (element.tagName === 'A' && /\b(demo|visit website|live site)\b/i.test(element.textContent) && !verifiedDemos.has(element.getAttribute('href'))) errors.push(`Unsupported website/demo action: ${file}`);
    }
    for (const button of page.querySelectorAll('button')) if (/\b(demo|visit website|live site)\b/i.test(button.textContent)) errors.push(`Unsupported demo button: ${file}`);
    for (const img of page.querySelectorAll('img')) if (!img.hasAttribute('alt') || !img.getAttribute('width') || !img.getAttribute('height')) errors.push(`Image missing alternative or dimensions: ${file}`);
  }
  for (const file of files.filter((file) => file.endsWith('.css'))) {
    const css = await readFile(resolve(root, file), 'utf8');
    for (const match of css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) await checkReference(match[1], `/${file}`);
  }
  return { htmlPages: pages.size, projectPages: records.length, checkedInternalFiles: files.length, errors: [...new Set(errors)] };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { projects } = await import('../src/content/projects.ts');
    const { profile } = await import('../src/content/profile.ts');
    const result = await checkStaticOutput(resolve(process.argv[2] || 'out'), projects, profile.email);
    console.log(JSON.stringify(result, null, 2));
    if (result.errors.length) process.exitCode = 1;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
