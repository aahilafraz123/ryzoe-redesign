'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/** Re-mounts per route: the incoming page settles in with a soft lift and unblur. */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(ref.current, { opacity: 0, y: 14, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out', clearProps: 'all' });
  });
  return <div ref={ref}>{children}</div>;
}
