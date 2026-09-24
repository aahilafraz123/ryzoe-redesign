'use client';

import { useEffect, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

/**
 * Owns smooth scrolling and every declarative scroll animation on the page.
 * Markup opts in through data attributes so server components stay static:
 *   data-split   headings rendered by <SplitHeading>, words rise out of a mask
 *   data-reveal  fade + lift + unblur on enter (children stagger with data-stagger)
 *   data-scrub   <ScrubText> words scrub from faint to solid while scrolling
 *   data-count   numeric count-up on enter
 *   data-draw    horizontal line draws in
 *   data-speed   parallax drift (number, e.g. -0.15)
 */
export default function MotionDirector() {
  const pathname = usePathname();

  // Smooth scroll lives for the whole session.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useIso(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);

    const mm = gsap.matchMedia();
    mm.add(
      { motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' },
      (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean };
        const q = <T extends Element>(s: string) => gsap.utils.toArray<T>(s);

        if (reduce) {
          gsap.set('[data-reveal], [data-reveal] > *', { opacity: 1 });
          gsap.set('.split-word > span', { y: 0, yPercent: 0 });
          q<HTMLElement>('[data-scrub] .scrub-w').forEach((w) => (w.style.opacity = '1'));
          return;
        }

        // Headings: words rise out of their masks.
        q<HTMLElement>('[data-split]').forEach((el) => {
          const words = el.querySelectorAll('.split-word > span');
          const immediate = el.hasAttribute('data-immediate');
          gsap.fromTo(
            words,
            { y: 0, yPercent: 115, rotate: 3 },
            {
              y: 0,
              yPercent: 0,
              rotate: 0,
              duration: 1.25,
              ease: 'expo.out',
              stagger: 0.045,
              delay: immediate ? 0.15 : 0,
              scrollTrigger: immediate ? undefined : { trigger: el, start: 'top 88%', once: true },
            },
          );
        });

        // Generic reveals.
        q<HTMLElement>('[data-reveal]').forEach((el) => {
          const targets = el.hasAttribute('data-stagger') ? Array.from(el.children) : [el];
          if (el.hasAttribute('data-stagger')) gsap.set(el, { opacity: 1, y: 0, filter: 'none' });
          const immediate = el.hasAttribute('data-immediate');
          gsap.fromTo(
            targets,
            { opacity: 0, y: 36, filter: 'blur(10px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1.1,
              ease: 'expo.out',
              stagger: 0.08,
              delay: immediate ? Number(el.dataset.delay ?? 0.35) : 0,
              clearProps: 'filter',
              scrollTrigger: immediate ? undefined : { trigger: el, start: 'top 90%', once: true },
            },
          );
        });

        // Scrubbed word reveals.
        q<HTMLElement>('[data-scrub]').forEach((el) => {
          gsap.fromTo(
            el.querySelectorAll('.scrub-w'),
            { opacity: 0.12 },
            { opacity: 1, ease: 'none', stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 } },
          );
        });

        // Count-ups.
        q<HTMLElement>('[data-count]').forEach((el) => {
          const raw = el.dataset.count ?? el.textContent ?? '';
          const n = parseFloat(raw);
          if (Number.isNaN(n)) return;
          const suffix = raw.replace(/^[\d.]+/, '');
          const obj = { v: 0 };
          gsap.to(obj, {
            v: n,
            duration: 1.8,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            onUpdate: () => (el.textContent = Math.round(obj.v) + suffix),
          });
        });

        // Lines drawing in.
        q<HTMLElement>('[data-draw]').forEach((el) => {
          gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 95%', once: true } });
        });

        // Parallax drift.
        q<HTMLElement>('[data-speed]').forEach((el) => {
          const speed = parseFloat(el.dataset.speed ?? '0');
          gsap.to(el, { yPercent: speed * 100, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
      },
    );

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    const t = window.setTimeout(refresh, 600);
    return () => {
      window.clearTimeout(t);
      mm.revert();
    };
  }, [pathname]);

  return null;
}
