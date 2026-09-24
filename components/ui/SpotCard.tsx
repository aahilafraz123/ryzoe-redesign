'use client';

import Link from 'next/link';
import clsx from 'clsx';
import type { ReactNode, MouseEvent } from 'react';

type Props = { href?: string | null; className?: string; children: ReactNode; tilt?: boolean };

/** Card with a cursor-following spotlight and an optional gentle 3D tilt. */
export default function SpotCard({ href, className, children, tilt = false }: Props) {
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    if (tilt) {
      const rx = ((y / r.height) - 0.5) * -5;
      const ry = ((x / r.width) - 0.5) * 6;
      el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    }
  };
  const onLeave = (e: MouseEvent<HTMLElement>) => {
    if (tilt) e.currentTarget.style.transform = '';
  };
  const cls = clsx(
    'spot group relative block overflow-hidden rounded-[1.75rem] transition-[transform,box-shadow,background-color] duration-700 ease-[var(--ease-out-expo)]',
    className,
  );
  if (href) {
    return (
      <Link href={href} className={cls} onMouseMove={onMove} onMouseLeave={onLeave}>
        {children}
      </Link>
    );
  }
  return (
    <div className={cls} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}
