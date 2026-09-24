'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitHeading from '@/components/motion/SplitHeading';
import Button from '@/components/ui/Button';
import { useStage } from '@/components/three/useStage';
import { homeContent } from '@/lib/home';

gsap.registerPlugin(ScrollTrigger);
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

export default function Hero() {
  const { hero } = homeContent;
  const root = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const stage = useStage(root);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => (progress.current = self.progress),
      });
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.to(content.current, {
        yPercent: -18,
        opacity: 0,
        filter: 'blur(8px)',
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: '75% top', scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-nav="dark" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-black text-white">
      {/* Static light field: shown before WebGL mounts and as the no-WebGL fallback. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 size-[70vmin] -translate-x-[60%] -translate-y-1/2 rounded-full bg-[#2997ff]/30 blur-[120px] [animation:drift_14s_ease-in-out_infinite]" />
        <div className="absolute left-1/2 top-1/2 size-[60vmin] -translate-x-[20%] -translate-y-[40%] rounded-full bg-[#7a5cff]/20 blur-[120px] [animation:drift_18s_ease-in-out_infinite_reverse]" />
      </div>
      {stage.ready && stage.webgl && (
        <div aria-hidden className="absolute inset-0 -z-10 opacity-0 [animation:fade-in_2s_0.2s_ease_forwards]">
          <HeroScene progress={progress} active={stage.active} reduced={stage.reduced} compact={stage.compact} />
        </div>
      )}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.55)_75%)]" />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />

      <div ref={content} className="shell relative flex flex-col items-center pb-24 pt-36 text-center md:pb-28">
        <p className="eyebrow mb-8 !text-white/55" data-reveal="" data-immediate="" data-delay="0.1">
          {hero.eyebrow}
        </p>
        <SplitHeading as="h1" text={hero.title} immediate className="display mx-auto max-w-6xl text-white" />
        <p className="lede mx-auto mt-8 max-w-2xl !text-white/65" data-reveal="" data-immediate="" data-delay="0.55">
          {hero.lead}
        </p>
        <div className="mt-11 flex flex-wrap items-center justify-center gap-3" data-reveal="" data-immediate="" data-delay="0.75">
          <Button href={hero.actions[0].href} variant="light">
            {hero.actions[0].label}
          </Button>
          <Button href={hero.actions[1].href} variant="ghost-light" arrow={false}>
            {hero.actions[1].label}
          </Button>
        </div>
      </div>

      <div aria-hidden className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:flex flex-col items-center gap-3 text-white/40">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em]">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-white/70 [animation:scroll-cue_2.2s_ease-in-out_infinite]" />
        </span>
      </div>
    </section>
  );
}
