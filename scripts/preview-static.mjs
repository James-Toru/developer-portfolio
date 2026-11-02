import { readFile, realpath, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve, extname, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { outputPath } from './output-utils.mjs';

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json', '.avif': 'image/avif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.png': 'image/png' };
export async function staticResponse(root, requestPath, method = 'GET', acceptEncoding = '') {
  const simple = (status, text) => ({ status, headers: { 'Content-Type': 'text/plain; charset=utf-8', ...(status === 405 ? { Allow: 'GET, HEAD' } : {}) }, body: method === 'HEAD' ? Buffer.alloc(0) : Buffer.from(text) });
  if (!['GET', 'HEAD'].includes(method)) return simple(405, 'Method not allowed');
  let target;
  try { target = outputPath(root, requestPath.split('?')[0]); }
  catch { return simple(400, 'Invalid path'); }
  let status = 200;
  try {
    if ((await stat(target)).isDirectory()) target = resolve(target, 'index.html');
    const inside = relative(await realpath(root), await realpath(target));
    if (inside.startsWith('..') || isAbsolute(inside)) return simple(400, 'Invalid path');
    if (!(await stat(target)).isFile()) throw new Error();
  } catch { target = resolve(root, '404.html'); status = 404; }
  // Re-check the fallback too: even a custom404 symlink may not escape out/.
  try {
    const inside = relative(await realpath(root), await realpath(target));
    if (inside.startsWith('..') || isAbsolute(inside)) return simple(400, 'Invalid path');
  } catch { return simple(404, 'Not found; build the static export first'); }
  let body;
  try { body = await readFile(target); } catch { return simple(404, 'Not found; build the static export first'); }
  const type = types[extname(target)] || 'application/octet-stream';
  const headers = { 'Content-Type': type, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff', Vary: 'Accept-Encoding' };
  const gzipAccepted = acceptEncoding.split(',').some((entry) => {
    const [encoding, ...parameters] = entry.trim().toLowerCase().split(';');
    const quality = parameters.find((p) => p.trim().startsWith('q='));
    return encoding === 'gzip' && (!quality || Number(quality.trim().slice(2)) > 0);
  });
  if (gzipAccepted && /^(text\/|application\/json|image\/svg)/.test(type)) {
    body = gzipSync(body, { level: 9 });
    headers['Content-Encoding'] = 'gzip';
  }
  headers['Content-Length'] = String(body.length);
  return { status, headers, body: method === 'HEAD' ? Buffer.alloc(0) : body };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.argv[2] || 4173);
  const root = resolve('out');
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port');
  createServer(async (request, response) => {
    try {
      const result = await staticResponse(root, request.url || '/', request.method, request.headers['accept-encoding'] || '');
      // Optional local QA mode; does not change the exported site.
      if (process.argv.includes('--block-images')) result.headers['Content-Security-Policy'] = "img-src 'none'";
      response.writeHead(result.status, result.headers); response.end(result.body);
    }
    catch { response.writeHead(500); response.end('Preview error'); }
  }).listen(port, '127.0.0.1', () => console.log(`Local static preview: http://127.0.0.1:${port}/ (out/ only; custom 404; gzip)`));
}
