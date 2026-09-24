'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/**
 * Site-wide watermark. Fixed in the same corner on every page; mix-blend-difference
 * keeps it legible over light pages, dark chapters and the 3D hero alike.
 */
export default function MadeBy() {
  useEffect(() => {
    console.log(
      '%cMade by Aahil%c  Designed & engineered by Aahil Afraz · https://aahilafraz.com/#/vault',
      'font:600 14px system-ui;color:#fff;background:#1d1d1f;padding:6px 10px;border-radius:999px',
      'font:12px system-ui;color:#6e6e73',
    );
  }, []);

  return (
    <Link
      href="/contact"
      aria-label="Made by Aahil: designed and built by Aahil Afraz. Get in touch."
      className="group fixed bottom-4 left-4 z-[70] flex items-center gap-2.5 rounded-full bg-white py-2 pl-3 pr-4 text-black mix-blend-difference shadow-[0_0_0_1px_rgba(255,255,255,0.4)] transition-[padding] duration-500 ease-[var(--ease-out-expo)] hover:pr-5 md:bottom-6 md:left-6"
    >
      <span aria-hidden className="relative flex size-2">
        <span className="absolute inset-0 rounded-full bg-black opacity-60 [animation:made-ping_2.4s_ease-out_infinite]" />
        <span className="relative size-2 rounded-full bg-black" />
      </span>
      <span className="text-[0.8rem] font-medium tracking-[-0.01em]">
        Made by Aahil
      </span>
      <span
        aria-hidden
        className="grid max-w-0 overflow-hidden whitespace-nowrap text-[0.8rem] text-black/80 opacity-0 transition-[max-width,opacity] duration-500 ease-[var(--ease-out-expo)] group-hover:max-w-[8rem] group-hover:opacity-100"
      >
        · say hello →
      </span>
    </Link>
  );
}
