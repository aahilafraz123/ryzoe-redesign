'use client';

import { useRouter } from 'next/navigation';
import { createElement, type MouseEvent } from 'react';
import { withBase, BASE } from '@/lib/base';

type Props = { html: string; as?: keyof React.JSX.IntrinsicElements; className?: string; id?: string };

/** Renders scraped inline HTML; internal links route client-side so page transitions stay smooth. */
export default function Html({ html, as = 'span', className, id }: Props) {
  const router = useRouter();
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const href = a.getAttribute('href') ?? '';
    if (href.startsWith(BASE + '/') || (BASE === '' && href.startsWith('/'))) {
      e.preventDefault();
      router.push(href.slice(BASE.length) || '/');
    }
  };
  return createElement(as, { className, id, onClick, dangerouslySetInnerHTML: { __html: withBase(html) } });
}
