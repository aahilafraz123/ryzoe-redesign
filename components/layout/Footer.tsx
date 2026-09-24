import Link from 'next/link';
import { asset } from '@/lib/base';
import { AAHIL } from '@/lib/aahil';

const COLS = [
  { title: 'Company', links: [['About', '/about'], ['Careers', '/careers'], ['Contact', '/contact']] },
  {
    title: 'Services',
    links: [
      ['Custom Software Development', '/services/custom-software-development'],
      ['Web Development', '/services/web-development'],
      ['Mobile App Development', '/services/mobile-app-development'],
      ['SaaS Development', '/services/saas-development'],
      ['AI Solutions', '/services/ai-solutions'],
    ],
  },
  {
    title: 'Products',
    links: [
      ['POS Daily', '/products/pos-daily'],
      ['Smart Safe', '/products/smart-safe'],
      ['Salon Platform', '/products/salon-platform'],
      ['Custom Product Development', '/products/custom-product-development'],
    ],
  },
];

export default function Footer() {
  return (
    <footer data-nav="dark" className="dark-scope relative overflow-hidden bg-black text-white">
      <div className="shell pb-10 pt-24 md:pt-32">
        <div className="grid gap-14 md:grid-cols-12">
          <p className="max-w-sm text-[1.35rem] font-medium leading-snug tracking-[-0.025em] text-white/90 md:col-span-4">
            Sri Lanka&apos;s Next-Generation Software &amp; AI Solutions Company
          </p>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-8">
            {COLS.map((c) => (
              <div key={c.title}>
                <p className="eyebrow mb-5 !text-white/40">{c.title}</p>
                <ul className="space-y-3">
                  {c.links.map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className="text-[0.95rem] text-white/70 transition-colors duration-300 hover:text-white">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-24 select-none md:mt-32" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/ryzoe-logo.png')} alt="" width={629} height={100} className="w-full opacity-[0.07] brightness-0 invert" data-speed="-0.08" />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Ryzoe. All rights reserved.{' '}
            <Link href="/contact" className="text-white/70 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white">
              Redesign concept designed &amp; built by {AAHIL.name}
            </Link>
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
