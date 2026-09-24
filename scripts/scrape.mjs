// Crawls ryzoe.com and writes structured page content to content/pages.json.
// Every internal page reachable from the sitemap or from links is captured.
import { parseHTML } from 'linkedom';
import { writeFile, mkdir } from 'node:fs/promises';

const ORIGIN = 'https://ryzoe.com';
const INLINE = new Set(['A', 'STRONG', 'EM', 'B', 'I', 'CODE', 'BR']);
const SKIP_EXT = /\.(png|jpe?g|svg|webp|gif|pdf|xml|txt|ico|json)$/i;

async function get(path) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(ORIGIN + path, { headers: { 'user-agent': 'Mozilla/5.0 ryzoe-redesign-scraper' } });
      if (r.ok) return await r.text();
      if (r.status === 404) return null;
    } catch {}
    await new Promise((res) => setTimeout(res, 800 * (i + 1)));
  }
  return null;
}

const norm = (s) => s.replace(/\s+/g, ' ').trim();

function internalPath(href) {
  if (!href) return null;
  try {
    const u = new URL(href, ORIGIN);
    if (u.origin !== ORIGIN) return null;
    if (SKIP_EXT.test(u.pathname) || u.pathname.startsWith('/_next')) return null;
    return u.pathname.replace(/\/$/, '') || '/';
  } catch {
    return null;
  }
}

// Serialize inline HTML keeping only safe inline tags. Raw markdown links in copy become anchors.
function inlineHtml(node) {
  let out = '';
  for (const c of node.childNodes) {
    if (c.nodeType === 3) {
      out += c.textContent.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    } else if (c.nodeType === 1) {
      if (c.tagName === 'svg' || c.tagName === 'SVG') continue;
      if (INLINE.has(c.tagName)) {
        const tag = c.tagName.toLowerCase();
        if (tag === 'br') { out += '<br>'; continue; }
        if (tag === 'a') {
          const href = c.getAttribute('href') || '';
          if (href.startsWith('#')) { out += `<a href="${href}">${inlineHtml(c)}</a>`; continue; }
          const p = internalPath(href);
          out += `<a href="${p ? p + (href.includes('#') ? '#' + href.split('#')[1] : '') : href}">${inlineHtml(c)}</a>`;
        } else out += `<${tag}>${inlineHtml(c)}</${tag}>`;
      } else out += inlineHtml(c);
    }
  }
  return out.replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, '<a href="$2">$1</a>').replace(/\s+/g, ' ');
}

const text = (el) => norm(el?.textContent || '');

function cardFrom(el) {
  const href = el.tagName === 'A' ? el.getAttribute('href') : el.querySelector('a')?.getAttribute('href');
  const titleEl = el.querySelector('h2,h3,h4');
  const lines = [];
  const walk = (n) => {
    for (const c of n.children) {
      if (c === titleEl || c.tagName === 'svg' || c.tagName === 'SVG') continue;
      const hasBlockKids = [...c.children].some((k) => !INLINE.has(k.tagName) && k.tagName !== 'svg' && k.tagName !== 'SVG');
      if (hasBlockKids) walk(c);
      else {
        const t = norm(c.textContent);
        if (t) lines.push({ tag: c.tagName.toLowerCase(), html: inlineHtml(c).trim() });
      }
    }
  };
  walk(el);
  return { title: titleEl ? text(titleEl) : null, href: internalPath(href) || href || null, lines };
}

function listToBlock(list, faqMap) {
  const items = [...list.children].filter((c) => c.tagName === 'LI');
  const structured = items.some((li) => li.querySelector('h2,h3,h4') || (li.querySelector('a') && li.querySelector('a').children.length));
  if (structured) return { t: 'cards', items: items.map((li) => cardFrom(li.querySelector(':scope > a') || li)) };
  const isStat = (li) => li.children.length === 2 && /^[\d.,]+\+?%?$/.test(norm(li.children[0].textContent));
  if (list.tagName === 'UL' && items.length && items.every(isStat)) return { t: 'stats', items: items.map((li) => ({ value: norm(li.children[0].textContent), label: norm(li.children[1].textContent) })) };
  const spans = items.every((li) => li.children.length >= 2 && [...li.children].every((k) => k.tagName === 'SPAN'));
  if (list.tagName === 'OL' && spans) return { t: 'steps', items: items.map((li) => norm(li.lastElementChild.textContent)) };
  return { t: 'list', ordered: list.tagName === 'OL', items: items.map((li) => inlineHtml(li).trim()) };
}

function blocks(el, faqMap, out = []) {
  for (const c of el.children) {
    const tag = c.tagName;
    if (tag === 'SCRIPT' || tag === 'svg' || tag === 'SVG' || tag === 'BUTTON' && !c.closest('[data-slot="accordion-item"]')) continue;
    if (c.getAttribute('aria-hidden') === 'true') continue;
    if (c.getAttribute('data-slot') === 'accordion-item') {
      const q = text(c.querySelector('button') || c.querySelector('h3'));
      const region = c.querySelector('[role="region"]');
      const a = faqMap.get(q) || (region ? inlineHtml(region).trim() : '');
      const last = out[out.length - 1];
      if (last?.t === 'faq') last.items.push({ q, a });
      else out.push({ t: 'faq', items: [{ q, a }] });
      continue;
    }
    if (/^H[1-6]$/.test(tag)) { out.push({ t: 'h', level: +tag[1], html: inlineHtml(c).trim() }); continue; }
    if (tag === 'P') { const h = inlineHtml(c).trim(); if (h) out.push({ t: 'p', html: h }); continue; }
    if (tag === 'BLOCKQUOTE') { out.push({ t: 'quote', html: [...c.querySelectorAll('p')].map(inlineHtml).join('<br><br>').trim() || inlineHtml(c).trim() }); continue; }
    if (tag === 'UL' || tag === 'OL') { out.push(listToBlock(c, faqMap)); continue; }
    if (tag === 'TABLE') {
      const rows = [...c.querySelectorAll('tr')].map((tr) => [...tr.children].map((td) => ({ head: td.tagName === 'TH', html: inlineHtml(td).trim() })));
      out.push({ t: 'table', rows });
      continue;
    }
    if (tag === 'PRE') { out.push({ t: 'code', text: c.textContent }); continue; }
    if (tag === 'A') {
      const blockKids = [...c.children].some((k) => !INLINE.has(k.tagName) && k.tagName !== 'svg' && k.tagName !== 'SVG');
      if (blockKids) {
        const card = cardFrom(c);
        const last = out[out.length - 1];
        if (last?.t === 'cards' && last.loose) last.items.push(card);
        else out.push({ t: 'cards', loose: true, items: [card] });
      } else {
        const label = text(c);
        const h = c.getAttribute('href') || '';
        if (label) out.push({ t: 'link', label, href: h.startsWith('#') || h.startsWith('mailto:') ? h : internalPath(h) || h });
      }
      continue;
    }
    if (tag === 'FORM') {
      out.push({ t: 'form', fields: [...c.querySelectorAll('input,textarea,select')].map((i) => ({ name: i.getAttribute('name'), type: i.tagName === 'TEXTAREA' ? 'textarea' : i.getAttribute('type') || 'text', label: text(c.querySelector(`label[for="${i.id}"]`)) || i.getAttribute('placeholder') || i.getAttribute('name'), required: i.hasAttribute('required') })), notes: [...c.querySelectorAll('p')].filter((x) => x.querySelector('a')).map((x) => inlineHtml(x).trim()) });
      continue;
    }
    // Groups made purely of links become an action row.
    const kids = [...c.children];
    if (kids.length && kids.every((k) => k.tagName === 'A' && ![...k.children].some((x) => !INLINE.has(x.tagName) && x.tagName !== 'svg' && x.tagName !== 'SVG'))) {
      out.push({ t: 'actions', items: kids.map((k) => { const h = k.getAttribute('href') || ''; return { label: text(k), href: h.startsWith('#') || h.startsWith('mailto:') ? h : internalPath(h) || h }; }) });
      continue;
    }
    // Leaf text inside div/span (e.g. stat values, labels).
    const hasElementKids = [...c.children].some((k) => k.tagName !== 'svg' && k.tagName !== 'SVG');
    if (!hasElementKids || [...c.children].every((k) => INLINE.has(k.tagName))) {
      const h = inlineHtml(c).trim();
      if (h) out.push({ t: 'span', html: h });
      continue;
    }
    blocks(c, faqMap, out);
  }
  return out;
}

function parsePage(path, html) {
  const { document } = parseHTML(html);
  const title = document.querySelector('title')?.textContent || '';
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const main = document.querySelector('main');
  const links = new Set();
  document.querySelectorAll('a[href]').forEach((a) => { const p = internalPath(a.getAttribute('href')); if (p) links.add(p); });
  if (!main) return { page: { path, title, description, blocks: [] }, links };

  const faqMap = new Map();
  main.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
    try {
      const data = [].concat(JSON.parse(s.textContent));
      data.forEach((d) => d['@type'] === 'FAQPage' && d.mainEntity.forEach((q) => faqMap.set(norm(q.name), q.acceptedAnswer.text)));
    } catch {}
  });

  // Hero header
  let hero = null;
  const header = main.querySelector(':scope > header');
  if (header) {
    const crumbs = [...header.querySelectorAll('nav ol li')].map((li) => { const a = li.querySelector('a'); return { label: text(a || li.querySelector('span:last-child') || li).replace(/^\/\s*/, ''), href: a ? internalPath(a.getAttribute('href')) : null }; });
    header.querySelector('nav')?.remove();
    const h1 = header.querySelector('h1');
    const hb = blocks(header, faqMap).filter((b) => !(b.t === 'h' && b.level === 1));
    const h1Index = h1 ? [...header.querySelectorAll('*')].indexOf(h1) : -1;
    const before = [...header.querySelectorAll('p')].filter((p) => [...header.querySelectorAll('*')].indexOf(p) < h1Index).map((p) => text(p));
    hero = {
      crumbs,
      eyebrow: before[0] || null,
      title: h1 ? text(h1) : '',
      blocks: hb.filter((b) => !(b.t === 'p' && before.includes(norm(b.html.replace(/<[^>]+>/g, ''))))),
    };
    header.remove();
  }

  // Skip in-page jump nav
  main.querySelectorAll(':scope > nav').forEach((n) => n.remove());

  const sections = [];
  for (const child of main.children) {
    if (child.tagName === 'SCRIPT') continue;
    if (child.tagName === 'ARTICLE') { sections.push({ kind: 'article', blocks: blocks(child, faqMap) }); continue; }
    const b = blocks(child, faqMap);
    if (!b.length) continue;
    // Eyebrow: short paragraph immediately before an h2
    let eyebrow = null, heading = null;
    const hi = b.findIndex((x) => x.t === 'h' && x.level === 2);
    if (hi > -1) {
      heading = b[hi].html;
      const prev = b[hi - 1];
      if (hi === 1 && prev && (prev.t === 'p' || prev.t === 'span') && prev.html.length < 40 && !prev.html.includes('<')) { eyebrow = prev.html; b.splice(hi - 1, 2); }
      else if (hi === 0) b.splice(0, 1);
      else heading = null;
    }
    sections.push({ id: child.getAttribute('id') || null, eyebrow, heading, blocks: b });
  }
  return { page: { path, title, description, hero, sections }, links };
}

async function main() {
  const queue = ['/', '/contact'];
  const sm = await get('/sitemap-0.xml');
  if (sm) for (const m of sm.matchAll(/<loc>([^<]+)<\/loc>/g)) { const p = internalPath(m[1]); if (p) queue.push(p); }
  const seen = new Set();
  const pages = {};
  while (queue.length) {
    const batch = [];
    while (queue.length && batch.length < 6) { const p = queue.shift(); if (!seen.has(p)) { seen.add(p); batch.push(p); } }
    await Promise.all(batch.map(async (p) => {
      const html = await get(p);
      if (!html) { console.warn('skip', p); return; }
      const { page, links } = parsePage(p, html);
      pages[p] = page;
      links.forEach((l) => !seen.has(l) && queue.push(l));
      console.log('ok', p);
    }));
  }
  await mkdir('content', { recursive: true });
  const ordered = Object.fromEntries(Object.keys(pages).sort().map((k) => [k, pages[k]]));
  await writeFile('content/pages.json', JSON.stringify(ordered, null, 1));
  console.log('pages:', Object.keys(pages).length);
}

main();
