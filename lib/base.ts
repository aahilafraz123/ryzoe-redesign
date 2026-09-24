export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Prefix root-relative hrefs inside raw HTML with the deploy base path. */
export function withBase(html: string): string {
  if (!BASE) return html;
  return html.replace(/href="\/(?!\/)/g, `href="${BASE}/`);
}

/** Path for a file in /public. */
export const asset = (p: string) => `${BASE}${p}`;

export const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);
