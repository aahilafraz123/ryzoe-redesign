'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { useRef, type ReactNode, type MouseEvent } from 'react';
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { isExternal } from '@/lib/base';

type Variant = 'primary' | 'secondary' | 'light' | 'ghost-light' | 'text';

const styles: Record<Variant, string> = {
  primary: 'bg-ink text-white hover:bg-black',
  secondary: 'bg-white/70 text-ink ring-1 ring-inset ring-black/10 hover:ring-black/25 backdrop-blur',
  light: 'bg-white text-ink hover:bg-white/90',
  'ghost-light': 'bg-white/5 text-white ring-1 ring-inset ring-white/20 hover:bg-white/10 hover:ring-white/40 backdrop-blur',
  text: 'text-ink px-0! hover:text-accent',
};

type Props = { href: string; children: ReactNode; variant?: Variant; className?: string; arrow?: boolean; magnetic?: boolean };

/** Pill button with a subtle magnetic pull and an arrow that nudges on hover. */
export default function Button({ href, children, variant = 'primary', className, arrow = true, magnetic = true }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const ext = isExternal(href);
  const Icon = ext && !href.startsWith('mailto:') ? ArrowUpRight : ArrowRight;

  const onMove = (e: MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.28;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  const cls = clsx(
    'group relative inline-flex h-12 items-center gap-2 rounded-full px-6 text-[0.95rem] font-medium tracking-[-0.01em]',
    'transition-[background-color,box-shadow,color,transform] duration-500 ease-[var(--ease-out-expo)] will-change-transform',
    styles[variant],
    className,
  );
  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <Icon weight="bold" className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5" aria-hidden />
      )}
    </>
  );

  if (ext || href.startsWith('#')) {
    return (
      <a ref={ref} href={href} className={cls} onMouseMove={onMove} onMouseLeave={onLeave} {...(ext && !href.startsWith('mailto:') ? { target: '_blank', rel: 'noreferrer' } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <Link ref={ref} href={href} className={cls} onMouseMove={onMove} onMouseLeave={onLeave}>
      {inner}
    </Link>
  );
}
