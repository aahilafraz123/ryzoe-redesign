'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import gsap from 'gsap';
import { asset } from '@/lib/base';
import { getLenis } from '@/components/motion/MotionDirector';

export const NAV = [
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

export default function GlassNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const clean = pathname.replace(/^\/ryzoe-redesign/, '').replace(/\/$/, '') || '/';

  // Shrink on scroll; switch to dark glass over sections marked data-nav="dark".
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const probe = 36;
      const darkEls = document.querySelectorAll<HTMLElement>('[data-nav="dark"]');
      let isDark = false;
      darkEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) isDark = true;
      });
      setDark(isDark);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const t = window.setTimeout(onScroll, 100);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(t);
    };
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  // Full-screen menu: stop page scroll and stagger links in.
  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
      const links = menuRef.current?.querySelectorAll('[data-m]');
      if (links) gsap.fromTo(links, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.1 });
    } else {
      lenis?.start();
      document.documentElement.style.overflow = '';
    }
  }, [open]);

  const active = (href: string) => clean === href || clean.startsWith(href + '/');

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-4">
        <nav
          aria-label="Primary"
          className={clsx(
            'pointer-events-auto flex w-full items-center justify-between rounded-full border backdrop-blur-xl backdrop-saturate-150',
            'transition-[max-width,padding,background-color,border-color,box-shadow] duration-700 ease-[var(--ease-out-expo)]',
            scrolled ? 'max-w-[860px] py-1.5 pl-5 pr-1.5' : 'max-w-[1200px] py-2.5 pl-6 pr-2.5',
            dark || open
              ? 'border-white/10 bg-black/50 text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
              : 'border-black/[0.06] bg-white/65 text-ink shadow-[0_8px_32px_rgba(0,0,0,0.06)]',
          )}
        >
          <Link href="/" aria-label="Ryzoe home" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset('/ryzoe-logo.png')}
              alt="Ryzoe"
              width={629}
              height={100}
              className={clsx('h-[18px] w-auto transition-[filter] duration-500', (dark || open) && 'brightness-0 invert')}
            />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={clsx(
                    'relative rounded-full px-3.5 py-2 text-[0.875rem] tracking-[-0.01em] transition-colors duration-300',
                    active(n.href) ? 'opacity-100' : 'opacity-60 hover:opacity-100',
                  )}
                >
                  {n.label}
                  {active(n.href) && <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-current opacity-40" />}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className={clsx(
                'hidden rounded-full px-5 py-2.5 text-[0.875rem] font-medium tracking-[-0.01em] transition-colors duration-300 sm:inline-flex',
                dark || open ? 'bg-white text-ink hover:bg-white/90' : 'bg-ink text-white hover:bg-black',
              )}
            >
              Contact
            </Link>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="relative grid size-10 place-items-center rounded-full md:hidden"
            >
              <span className={clsx('absolute h-px w-4 bg-current transition-transform duration-500', open ? 'rotate-45' : '-translate-y-[3px]')} />
              <span className={clsx('absolute h-px w-4 bg-current transition-transform duration-500', open ? '-rotate-45' : 'translate-y-[3px]')} />
            </button>
          </div>
        </nav>
      </header>

      <div
        ref={menuRef}
        className={clsx(
          'fixed inset-0 z-40 bg-black text-white transition-[clip-path] duration-700 ease-[var(--ease-out-expo)] md:hidden',
          open ? '[clip-path:inset(0_0_0_0)]' : 'pointer-events-none [clip-path:inset(0_0_100%_0)]',
        )}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col justify-between px-6 pb-10 pt-28">
          <ul className="space-y-1">
            {[...NAV, { label: 'Contact', href: '/contact' }].map((n) => (
              <li key={n.href} className="overflow-hidden">
                <Link data-m="" href={n.href} tabIndex={open ? 0 : -1} className="block py-1.5 text-[2.6rem] font-semibold leading-tight tracking-[-0.04em]">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div data-m="" className="flex items-center justify-between text-sm text-white/50">
            <a href="mailto:hello@ryzoe.com" tabIndex={open ? 0 : -1}>hello@ryzoe.com</a>
            <Link href="/careers" tabIndex={open ? 0 : -1}>Careers</Link>
          </div>
        </div>
      </div>
    </>
  );
}
