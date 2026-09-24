'use client';

import { useEffect, useState, type RefObject } from 'react';

/** Visibility, motion preference, WebGL support and viewport class for a 3D stage. */
export function useStage(ref: RefObject<HTMLElement | null>) {
  const [state, setState] = useState({ active: false, reduced: false, compact: false, webgl: false, ready: false });

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compact = window.matchMedia('(max-width: 767px)').matches;
    let webgl = false;
    try {
      const c = document.createElement('canvas');
      webgl = !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch {}
    setState((s) => ({ ...s, reduced, compact, webgl, ready: true }));

    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setState((s) => ({ ...s, active: e.isIntersecting })), { rootMargin: '120px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return state;
}
