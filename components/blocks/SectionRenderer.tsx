import clsx from 'clsx';
import SectionHeader from './SectionHeader';
import BlockRenderer from './BlockRenderer';
import ScrubText from '@/components/motion/ScrubText';
import { stripTags, type Block, type Section } from '@/lib/content';

const WIDE: Block['t'][] = ['cards', 'stats', 'steps', 'form', 'table'];

/**
 * Lays out one scraped section as a chapter.
 * - Statement sections (a lone opening paragraph) get a scrubbed, oversized lead.
 * - Text sections use a split layout: sticky heading left, copy right.
 * - Card/step/stat sections stack full width under the header.
 */
export default function SectionRenderer({ section, index }: { section: Section; index: number }) {
  const bg = index % 2 === 0 ? 'bg-surface' : 'bg-canvas';
  const heading = section.heading ? stripTags(section.heading) : null;
  const blocks = section.blocks;
  const wide = blocks.some((b) => WIDE.includes(b.t) || (b.t === 'cards' && b.items.length > 1));

  // Opening statement: plain paragraph with no markup, scrubbed in at large size.
  const first = blocks[0];
  const statement = !wide && first?.t === 'p' && !first.html.includes('<') && first.html.length > 60 && first.html.length < 360;
  const rest = statement ? blocks.slice(1) : blocks;

  const formAt = blocks.findIndex((b) => b.t === 'form');
  if (formAt > -1) {
    return (
      <section id={section.id ?? undefined} className="bg-canvas pb-24 pt-4 md:pb-36">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <BlockRenderer blocks={[blocks[formAt]]} />
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-32">
              <BlockRenderer blocks={blocks.filter((_, i) => i !== formAt)} dense />
            </div>
          </aside>
        </div>
      </section>
    );
  }

  if (!heading) {
    return (
      <section id={section.id ?? undefined} className={clsx(bg, 'py-24 md:py-32')}>
        <div className="shell">
          <div className={clsx(!wide && 'max-w-3xl')}>
            <BlockRenderer blocks={blocks} />
          </div>
        </div>
      </section>
    );
  }

  if (wide) {
    return (
      <section id={section.id ?? undefined} className={clsx(bg, 'py-24 md:py-36')}>
        <div className="shell">
          <SectionHeader eyebrow={section.eyebrow} heading={heading} />
          <div className="mt-12 md:mt-16">
            <BlockRenderer blocks={blocks} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={section.id ?? undefined} className={clsx(bg, 'py-24 md:py-36')}>
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeader eyebrow={section.eyebrow} heading={heading} />
          </div>
        </div>
        <div className="flex flex-col gap-8 lg:col-span-7 lg:col-start-6">
          {statement && (
            <ScrubText segments={[{ text: (first as { html: string }).html.replace(/&amp;/g, '&') }]} className="text-[clamp(1.5rem,2.3vw,2.1rem)] font-medium leading-[1.3] tracking-[-0.03em] text-ink" />
          )}
          {rest.length > 0 && <BlockRenderer blocks={rest} />}
        </div>
      </div>
    </section>
  );
}
