'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import SplitHeading from '@/components/motion/SplitHeading';
import Button from '@/components/ui/Button';
import Html from '@/components/ui/Html';
import { useStage } from '@/components/three/useStage';
import type { Action } from '@/lib/content';

const WaveField = dynamic(() => import('@/components/three/WaveField'), { ssr: false });

type Props = { heading: string; text?: string; actions: Action[] };

/** Dark closing chapter with a live particle wave; flows straight into the dark footer. */
export default function CtaChapter({ heading, text, actions }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useStage(root);
  return (
    <section ref={root} data-nav="dark" className="dark-scope relative isolate overflow-hidden bg-black text-white">
      {stage.ready && stage.webgl && (
        <div aria-hidden className="absolute inset-0 -z-10 opacity-0 [animation:fade-in_1.6s_ease_forwards] [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_70%,transparent)]">
          <WaveField active={stage.active} reduced={stage.reduced} />
        </div>
      )}
      <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 size-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2997ff]/15 blur-[140px]" />
      <div className="shell flex flex-col items-center py-36 text-center md:py-52">
        <SplitHeading text={heading} className="display mx-auto max-w-5xl text-white" />
        {text && (
          <div data-reveal="">
            <Html as="p" html={text} className="lede inline-links mx-auto mt-7 max-w-xl !text-white/60" />
          </div>
        )}
        <div className="mt-11 flex flex-wrap justify-center gap-3" data-reveal="">
          {actions.map((a, i) => (
            <Button key={a.href + a.label} href={a.href} variant={i === 0 ? 'light' : 'ghost-light'} arrow={i === 0}>
              {a.label}
            </Button>
          ))}
        </div>
      </div>
      <div aria-hidden className="mx-auto h-px max-w-[1200px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}
