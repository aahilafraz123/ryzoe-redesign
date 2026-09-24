import Link from 'next/link';
import clsx from 'clsx';
import SplitHeading from '@/components/motion/SplitHeading';
import Html from '@/components/ui/Html';
import Button from '@/components/ui/Button';
import ServiceIcon from './ServiceIcon';
import { stripTags, type Hero } from '@/lib/content';

const isMeta = (html: string) => /·/.test(html) && stripTags(html).length < 80;

/** Light editorial hero shared by every inner page. */
export default function PageHero({ hero, path, article }: { hero: Hero; path: string; article?: boolean }) {
  const lead = hero.blocks.find((b) => b.t === 'p' && !isMeta(b.html)) as { html: string } | undefined;
  const metas = hero.blocks.filter((b) => b.t === 'p' && isMeta(b.html)) as { html: string }[];
  const actions = hero.blocks.find((b) => b.t === 'actions') as { items: { label: string; href: string }[] } | undefined;
  const extras = hero.blocks.filter((b) => b.t === 'p' && b !== lead && !metas.includes(b as { html: string })) as { html: string }[];
  const serviceHref = path.startsWith('/services/') ? path : null;

  return (
    <section className="relative overflow-hidden bg-canvas pb-20 pt-36 md:pb-28 md:pt-48">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-[radial-gradient(circle,rgba(41,151,255,0.16),transparent_65%)] [animation:drift_16s_ease-in-out_infinite]" />
      <div aria-hidden className="pointer-events-none absolute -left-32 top-1/2 size-[420px] rounded-full bg-[radial-gradient(circle,rgba(122,92,255,0.08),transparent_65%)] [animation:drift_20s_ease-in-out_infinite_reverse]" />

      <div className={clsx('shell relative', article && 'max-w-[980px]')}>
        {hero.crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-10" data-reveal="" data-immediate="" data-delay="0.05">
            <ol className="flex flex-wrap items-center gap-2 text-[0.82rem] text-faint">
              {hero.crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden className="text-black/20">/</span>}
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-ink">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-muted" aria-current="page">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="flex flex-col gap-8">
          {(hero.eyebrow || serviceHref) && (
            <div className="flex items-center gap-4" data-reveal="" data-immediate="" data-delay="0.1">
              {serviceHref && <ServiceIcon href={serviceHref} large />}
              {hero.eyebrow && <p className="eyebrow">{hero.eyebrow}</p>}
            </div>
          )}
          <SplitHeading as="h1" text={hero.title} immediate className={clsx('display max-w-6xl text-ink', article && '!text-[clamp(2.4rem,4.6vw,4.4rem)]')} />
          {lead && (
            <div data-reveal="" data-immediate="" data-delay="0.45">
              <Html as="p" html={lead.html} className="lede inline-links max-w-3xl" />
            </div>
          )}
          {extras.map((e, i) => (
            <div key={i} data-reveal="" data-immediate="" data-delay="0.5">
              <Html as="p" html={e.html} className="inline-links max-w-3xl text-[1.05rem] text-muted" />
            </div>
          ))}
          {metas.length > 0 && (
            <div className="flex flex-wrap gap-2" data-reveal="" data-immediate="" data-delay="0.55">
              {metas.map((m) => (
                <span key={m.html} className="rounded-full bg-surface px-4 py-2 font-mono text-[0.78rem] text-muted ring-1 ring-inset ring-black/[0.06]">
                  {stripTags(m.html)}
                </span>
              ))}
            </div>
          )}
          {actions && (
            <div className="mt-2 flex flex-wrap gap-3" data-reveal="" data-immediate="" data-delay="0.65">
              {actions.items.map((a, i) => (
                <Button key={a.href + a.label} href={a.href} variant={i === 0 ? 'primary' : 'secondary'} arrow={i === 0}>
                  {a.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
