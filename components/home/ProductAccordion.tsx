'use client';

import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';
import { ArrowUpRight } from '@phosphor-icons/react';
import SectionHeader from '@/components/blocks/SectionHeader';
import ProductArt from './ProductArt';
import { homeContent } from '@/lib/home';

/** Four vertical slices; the focused one expands horizontally to reveal its story. */
export default function ProductAccordion() {
  const { products } = homeContent;
  const [open, setOpen] = useState(0);

  return (
    <section data-nav="dark" className="dark-scope relative overflow-hidden bg-black py-32 text-white md:py-48">
      <div aria-hidden className="absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[#2997ff]/10 blur-[140px]" />
      <div className="shell relative">
        <SectionHeader eyebrow={products.eyebrow} heading={products.heading} dark />

        <div className="mt-16 flex flex-col gap-3 md:mt-24 md:h-[560px] md:flex-row" data-reveal="" data-stagger="">
          {products.items.map((p, i) => {
            const active = open === i;
            return (
              <Link
                key={p.href}
                href={p.href}
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                className={clsx(
                  'group relative flex min-h-[420px] overflow-hidden rounded-[2rem] bg-night-3 ring-1 ring-inset ring-white/[0.08] md:min-h-0',
                  'transition-[flex-grow,background-color] duration-[900ms] ease-[var(--ease-out-expo)]',
                  active ? 'md:flex-[3.2]' : 'md:flex-[1]',
                )}
              >
                <div className={clsx('absolute inset-0 transition-opacity duration-700 md:top-0', active ? 'opacity-100' : 'md:opacity-40')}>
                  <div className="absolute inset-x-0 top-0 h-[62%] md:h-[70%]">
                    <ProductArt index={i} />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-night-3 via-night-3/40 to-transparent" />

                {/* Collapsed label (desktop only) */}
                <span
                  aria-hidden
                  className={clsx(
                    'absolute bottom-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-[1.1rem] font-medium tracking-[-0.02em] text-white/70 transition-opacity duration-500 [writing-mode:vertical-rl] rotate-180 md:block',
                    active ? 'opacity-0' : 'opacity-100',
                  )}
                >
                  {p.title}
                </span>

                <div
                  className={clsx(
                    'relative mt-auto w-full p-8 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] md:min-w-[420px] md:p-10',
                    active ? 'md:translate-y-0 md:opacity-100 md:delay-200' : 'md:translate-y-6 md:opacity-0',
                  )}
                >
                  <h3 className="text-[clamp(1.8rem,2.6vw,2.4rem)] font-semibold leading-[1.05] tracking-[-0.04em]">{p.title}</h3>
                  <p className="mt-3 max-w-sm text-[1.02rem] leading-relaxed text-white/60">{p.text}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-[0.95rem] font-medium">
                    {p.cta}
                    <ArrowUpRight weight="bold" className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
