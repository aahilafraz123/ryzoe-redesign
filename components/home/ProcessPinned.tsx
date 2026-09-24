'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import SectionHeader from '@/components/blocks/SectionHeader';
import { homeContent } from '@/lib/home';

gsap.registerPlugin(ScrollTrigger);

/** Title pinned on the left while the seven phases scroll past on the right. */
export default function ProcessPinned() {
  const { process } = homeContent;
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      gsap.fromTo('[data-rail]', { scaleY: 0 }, { scaleY: 1, ease: 'none', transformOrigin: 'top', scrollTrigger: { trigger: '[data-steps]', start: 'top 55%', end: 'bottom 55%', scrub: true } });
      gsap.utils.toArray<HTMLElement>('[data-step]').forEach((el, i) => {
        ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => self.isActive && setActive(i) });
      });
    },
    { scope: root },
  );

  return (
    <section className="bg-surface py-32 md:py-48">
      <div ref={root} className="shell grid gap-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <SectionHeader eyebrow={process.eyebrow} heading={process.heading} lead={process.lead} />
            <div className="mt-12 hidden items-baseline gap-3 font-mono text-faint md:flex" aria-hidden>
              <span className="relative inline-block h-[1.2em] overflow-hidden text-[2.5rem] font-medium leading-none tracking-[-0.04em] text-ink tabular-nums">
                <span className="block transition-transform duration-700 ease-[var(--ease-out-expo)]" style={{ transform: `translateY(-${active * 1.2}em)` }}>
                  {process.items.map((s) => (
                    <span key={s.index} className="block h-[1.2em]">{s.index}</span>
                  ))}
                </span>
              </span>
              <span className="text-sm">/ {String(process.items.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        <ol data-steps="" className="relative md:col-span-6 md:col-start-7">
          <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-line" />
          <span aria-hidden data-rail="" className="absolute left-0 top-0 h-full w-px bg-ink" />
          {process.items.map((s, i) => (
            <li
              key={s.title}
              data-step=""
              className={clsx(
                'relative py-10 pl-10 transition-opacity duration-700 md:flex md:min-h-[38vh] md:flex-col md:justify-center md:pl-14',
                active === i ? 'md:opacity-100' : 'md:opacity-30',
              )}
            >
              <span aria-hidden className={clsx('absolute -left-[4.5px] top-1/2 size-2.5 -translate-y-1/2 rounded-full border transition-colors duration-500', active >= i ? 'border-ink bg-ink' : 'border-black/20 bg-surface')} />
              <span className="font-mono text-[0.75rem] tracking-[0.08em] text-faint">{s.index}</span>
              <h3 className="mt-3 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink">{s.title}</h3>
              <p className="mt-3 max-w-md text-[1.05rem] leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
