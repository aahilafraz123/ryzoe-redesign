'use client';

import Link from 'next/link';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from '@phosphor-icons/react';
import SectionHeader from '@/components/blocks/SectionHeader';
import Button from '@/components/ui/Button';
import CaseVisual from './CaseVisual';
import { homeContent } from '@/lib/home';

gsap.registerPlugin(ScrollTrigger);

/** Case studies stack on top of each other as you scroll; earlier cards recede. */
export default function CaseStack() {
  const { cases } = homeContent;
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-case]');
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card.querySelector('[data-case-inner]'), {
            scale: 0.94,
            ease: 'none',
            scrollTrigger: { trigger: next, start: 'top 70%', end: 'top 15%', scrub: true },
          });
          gsap.to(card.querySelector('[data-case-shade]'), {
            opacity: 0.18,
            ease: 'none',
            scrollTrigger: { trigger: next, start: 'top 70%', end: 'top 15%', scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="bg-canvas py-32 md:py-48">
      <div className="shell">
        <SectionHeader
          eyebrow={cases.eyebrow}
          heading={cases.heading}
          lead={cases.lead}
          aside={
            <Button href="/case-studies" variant="secondary">
              All case studies
            </Button>
          }
        />
        <div ref={root} className="mt-16 md:mt-24">
          {cases.items.map((c, i) => (
            <article
              key={c.href}
              data-case=""
              className="sticky mb-6 md:mb-10"
              style={{ top: `calc(96px + ${i * 14}px)` }}
            >
              <div data-case-inner="" className="relative origin-top will-change-transform">
                <Link
                  href={c.href}
                  className={`group grid overflow-hidden rounded-[2rem] md:min-h-[440px] md:grid-cols-2 ${i % 2 ? 'bg-night text-white' : 'bg-surface text-ink ring-1 ring-inset ring-black/[0.05]'}`}
                >
                  <div className="flex flex-col justify-end gap-10 p-8 md:p-12">
                    <div>
                      <h3 className="text-[clamp(1.8rem,3vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.04em]">{c.title}</h3>
                      <p className={`mt-4 max-w-md text-[1.05rem] leading-relaxed ${i % 2 ? 'text-white/60' : 'text-muted'}`}>{c.text}</p>
                      <span className="mt-8 inline-flex items-center gap-2 text-[0.95rem] font-medium">
                        {c.cta}
                        <ArrowUpRight weight="bold" className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                  <div className={`relative p-6 md:p-10 ${i % 2 ? 'bg-white/[0.03]' : 'bg-canvas'}`}>
                    <CaseVisual index={i} outcome={c.outcome} dark={i % 2 === 1} />
                  </div>
                </Link>
                <div data-case-shade="" aria-hidden className="pointer-events-none absolute inset-0 rounded-[2rem] bg-black opacity-0" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
