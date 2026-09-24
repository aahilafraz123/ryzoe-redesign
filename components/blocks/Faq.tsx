'use client';

import { useState } from 'react';
import clsx from 'clsx';
import Html from '@/components/ui/Html';

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        const id = `faq-${i}-${it.q.length}`;
        return (
          <div key={it.q} className="border-b border-line">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-7 text-left"
              >
                <span className="text-[1.2rem] font-medium tracking-[-0.02em] text-ink md:text-[1.35rem]">{it.q}</span>
                <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-canvas transition-colors duration-500 group-hover:bg-ink group-hover:text-white">
                  <span className="absolute h-px w-3.5 bg-current" />
                  <span className={clsx('absolute h-3.5 w-px bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]', isOpen && 'rotate-90 scale-y-0')} />
                </span>
              </button>
            </h3>
            <div id={id} role="region" className={clsx('grid transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-out-expo)]', isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
              <div className="overflow-hidden">
                <Html as="p" html={it.a} className="inline-links max-w-2xl pb-8 text-[1.05rem] leading-relaxed text-muted" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
