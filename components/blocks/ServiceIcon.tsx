'use client';

import clsx from 'clsx';
import { iconFor } from '@/components/home/ServicesBento';

export default function ServiceIcon({ href, large }: { href: string; large?: boolean }) {
  const Icon = iconFor(href);
  return (
    <span
      className={clsx(
        'grid place-items-center bg-canvas text-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-white',
        large ? 'size-16 rounded-[1.25rem]' : 'size-11 rounded-2xl',
      )}
    >
      <Icon size={large ? 28 : 20} />
    </span>
  );
}
