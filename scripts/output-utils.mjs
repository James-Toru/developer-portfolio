import { readdir, readFile } from 'node:fs/promises';
import { resolve, join, relative, isAbsolute } from 'node:path';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';

export async function filesWithin(root) {
  const files = [];
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) await walk(join(directory, entry.name));
      else if (entry.isFile()) files.push(relative(root, join(directory, entry.name)).replaceAll('\\', '/'));
    }
  }
  await walk(root);
  return files.sort();
}

export function outputPath(root, pathname) {
  const path = decodeURIComponent(pathname);
  if (path.includes('\0') || path.includes('\\') || path.split('/').includes('..')) throw new Error('Unsafe export path');
  const target = resolve(root, `.${path.startsWith('/') ? path : `/${path}`}`);
  const inside = relative(resolve(root), target);
  if (inside.startsWith('..') || isAbsolute(inside)) throw new Error('Outside export');
  return target;
}

export const routePath = (file) => file === 'index.html' ? '/' : file.endsWith('/index.html') ? `/${file.slice(0, -10)}` : `/${file}`;
export const byteSizes = (data) => ({ raw: data.length, gzip: gzipSync(data, { level: 9 }).length, brotli: brotliCompressSync(data, { params: { [constants.BROTLI_PARAM_QUALITY]: 6 } }).length });
export async function sizeFiles(root, paths, cache = new Map()) {
  const files = [];
  for (const path of [...new Set(paths)].sort()) {
    if (!cache.has(path)) cache.set(path, { path, ...byteSizes(await readFile(outputPath(root, path))) });
    files.push(cache.get(path));
  }
  return { files, raw: files.reduce((n, f) => n + f.raw, 0), gzip: files.reduce((n, f) => n + f.gzip, 0), brotli: files.reduce((n, f) => n + f.brotli, 0) };
}
