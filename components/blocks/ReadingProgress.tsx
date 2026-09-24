'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function ReadingProgress({ target }: { target: string }) {
  const bar = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', transformOrigin: 'left', scrollTrigger: { trigger: target, start: 'top 20%', end: 'bottom 80%', scrub: 0.3 } });
  });
  return <div ref={bar} aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-accent" />;
}
