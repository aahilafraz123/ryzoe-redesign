// Content parity: every text leaf inside <main> on ryzoe.com must appear in the rebuilt export.
// Usage: node scripts/parity.mjs   (after `next build`)
import { parseHTML } from 'linkedom';
import { readFile } from 'node:fs/promises';
import pages from '../content/pages.json' with { type: 'json' };

const ORIGIN = 'https://ryzoe.com';
const squash = (s) => s.replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, '$1').replace(/[\s ]+/g, '').toLowerCase();
const LEAF = 'h1,h2,h3,h4,h5,p,li,a,span,dt,dd,blockquote,label,button,td,th,strong';

let missingTotal = 0;
// /contact is intentionally replaced by the builder's own contact page.
const checked = Object.keys(pages).filter((p) => p !== '/contact');
for (const path of checked) {
  const res = await fetch(ORIGIN + path);
  const { document: od } = parseHTML(await res.text());
  const main = od.querySelector('main');
  main.querySelectorAll('script, svg, :scope > nav').forEach((n) => n.remove());

  const file = path === '/' ? 'out/index.html' : `out${path}/index.html`;
  const { document: nd } = parseHTML(await readFile(file, 'utf8'));
  nd.querySelectorAll('script').forEach((n) => n.remove());
  const rebuilt = squash(nd.querySelector('main')?.textContent ?? '');

  const missing = new Set();
  main.querySelectorAll(LEAF).forEach((el) => {
    // Only leaves: skip elements whose text is fully composed of child leaves.
    if (el.querySelector(LEAF) && [...el.childNodes].every((c) => c.nodeType !== 3 || !c.textContent.trim())) return;
    const t = el.textContent.replace(/\s+/g, ' ').trim();
    if (!t || t === '/' ) return;
    if (!rebuilt.includes(squash(t))) missing.add(t);
  });
  missingTotal += missing.size;
  console.log(`${missing.size ? 'MISSING' : 'ok     '} ${path}${missing.size ? '\n   - ' + [...missing].join('\n   - ') : ''}`);
}
console.log(`\n${checked.length} pages checked, ${missingTotal} missing text fragments.`);
process.exit(missingTotal ? 1 : 0);
