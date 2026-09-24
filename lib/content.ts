import pagesJson from '@/content/pages.json';

export type Line = { tag: string; html: string };
export type Card = { title: string | null; href: string | null; lines: Line[] };
export type Action = { label: string; href: string };
export type Block =
  | { t: 'h'; level: number; html: string }
  | { t: 'p'; html: string }
  | { t: 'span'; html: string }
  | { t: 'quote'; html: string }
  | { t: 'list'; ordered: boolean; items: string[] }
  | { t: 'steps'; items: string[] }
  | { t: 'stats'; items: { value: string; label: string }[] }
  | { t: 'cards'; loose?: boolean; items: Card[] }
  | { t: 'faq'; items: { q: string; a: string }[] }
  | { t: 'table'; rows: { head: boolean; html: string }[][] }
  | { t: 'code'; text: string }
  | { t: 'link'; label: string; href: string }
  | { t: 'actions'; items: Action[] }
  | { t: 'form'; fields: { name: string; type: string; label: string; required: boolean }[]; notes?: string[] };

export type Section = { id?: string | null; kind?: 'article'; eyebrow?: string | null; heading?: string | null; blocks: Block[] };
export type Hero = { crumbs: { label: string; href: string | null }[]; eyebrow: string | null; title: string; blocks: Block[] };
export type Page = { path: string; title: string; description: string; hero: Hero | null; sections: Section[] };

export const pages = pagesJson as unknown as Record<string, Page>;

export function getPage(path: string): Page | undefined {
  return pages[path];
}

export function allPaths(): string[] {
  return Object.keys(pages);
}

export const stripTags = (html: string) =>
  html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
