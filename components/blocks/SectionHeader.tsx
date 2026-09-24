import clsx from 'clsx';
import type { ReactNode } from 'react';
import SplitHeading from '@/components/motion/SplitHeading';
import Html from '@/components/ui/Html';

type Props = {
  eyebrow?: string | null;
  heading: string;
  lead?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  aside?: ReactNode;
  className?: string;
  insert?: { after: number; node: ReactNode };
};

export default function SectionHeader({ eyebrow, heading, lead, align = 'left', dark, aside, className, insert }: Props) {
  return (
    <div className={clsx('flex flex-col gap-8 md:flex-row md:items-end md:justify-between', align === 'center' && 'items-center text-center md:flex-col md:items-center', className)}>
      <div className={clsx('max-w-3xl', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <p className={clsx('eyebrow mb-5', dark && '!text-white/45')} data-reveal="">
            {eyebrow}
          </p>
        )}
        <SplitHeading text={heading} insert={insert} className={clsx('headline', dark ? 'text-white' : 'text-ink')} />
        {lead && (
          <div data-reveal="">
            <Html as="p" html={lead} className={clsx('lede inline-links mt-6 max-w-2xl', align === 'center' && 'mx-auto', dark && '!text-white/55')} />
          </div>
        )}
      </div>
      {aside && (
        <div className="shrink-0" data-reveal="">
          {aside}
        </div>
      )}
    </div>
  );
}
