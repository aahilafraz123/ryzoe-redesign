import clsx from 'clsx';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import Html from '@/components/ui/Html';
import Button from '@/components/ui/Button';
import SpotCard from '@/components/ui/SpotCard';
import Faq from './Faq';
import ContactForm from './ContactForm';
import ServiceIcon from './ServiceIcon';
import { stripTags, type Block, type Card } from '@/lib/content';

const CTA_RE = /^(Read|Learn|Explore|View|See|Discover)\b/i;
const isLabel = (html: string) => {
  const t = stripTags(html);
  return t.length <= 32 && !/[.?!:,]$/.test(t) && !html.includes('<a');
};

function CardItem({ card, variant }: { card: Card; variant: 'tile' | 'row' }) {
  const lines = card.lines.map((l) => ({ ...l, text: stripTags(l.html) }));
  const cta = lines.find((l) => CTA_RE.test(l.text) && l.text.length < 24 && card.href);
  const rest = lines.filter((l) => l !== cta);
  const meta = rest.length > 1 && rest[0].text.length < 40 && !/[.]$/.test(rest[0].text) ? rest[0] : null;
  const body = rest.filter((l) => l !== meta);
  const serviceHref = card.href?.startsWith('/services/') ? card.href : null;

  if (variant === 'row') {
    return (
      <SpotCard href={card.href} className="rounded-none! border-t border-line bg-transparent last:border-b">
        <div className="relative grid gap-3 py-9 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            {meta && <p className="eyebrow mb-3">{meta.text}</p>}
            {card.title && <h3 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.03em] text-ink transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5">{card.title}</h3>}
          </div>
          <div className="space-y-3 md:col-span-7">
            {body.map((l, i) => (
              <Html key={i} as="p" html={l.html} className="text-[1.02rem] leading-relaxed text-muted" />
            ))}
          </div>
          {card.href && (
            <span className="flex items-start justify-end md:col-span-1">
              <span className="inline-flex items-center gap-2 text-[0.9rem] font-medium text-ink">
                <span className="md:sr-only">{cta?.text ?? 'Open'}</span>
                <ArrowUpRight weight="bold" className="size-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </span>
          )}
        </div>
      </SpotCard>
    );
  }

  return (
    <SpotCard
      href={card.href}
      tilt={!!card.href}
      className={clsx('bg-surface ring-1 ring-inset ring-black/[0.05]', card.href && 'hover:shadow-[0_30px_70px_-30px_rgba(0,0,0,0.2)]')}
    >
      <div className="relative flex h-full min-h-[220px] flex-col justify-between gap-8 p-7 md:p-8">
        <div className="flex items-start justify-between gap-4">
          {serviceHref ? <ServiceIcon href={serviceHref} /> : meta ? <p className="eyebrow">{meta.text}</p> : <span className="block h-px w-8 bg-ink/30" />}
          {card.href && <ArrowUpRight weight="bold" className="size-4 shrink-0 text-faint transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />}
        </div>
        <div>
          {serviceHref && meta && <p className="eyebrow mb-3">{meta.text}</p>}
          {card.title && <h3 className="text-[1.3rem] font-semibold leading-[1.2] tracking-[-0.03em] text-ink">{card.title}</h3>}
          {body.map((l, i) => (
            <Html key={i} as="p" html={l.html} className={clsx('inline-links leading-relaxed', i === 0 ? 'mt-3 text-[0.98rem] text-muted' : 'mt-3 font-mono text-[0.78rem] text-faint')} />
          ))}
          {cta && (
            <span className="mt-6 inline-flex items-center gap-2 text-[0.92rem] font-medium text-ink">{cta.text}</span>
          )}
        </div>
      </div>
    </SpotCard>
  );
}

/** Column count that leaves no empty grid cells; a leading card spans 2 when needed. */
function gridFor(n: number) {
  if (n === 1) return { cols: 'md:grid-cols-1 max-w-2xl', span: false };
  if (n === 2 || n === 4) return { cols: 'md:grid-cols-2', span: false };
  if (n % 3 === 0) return { cols: 'md:grid-cols-2 lg:grid-cols-3', span: false };
  return { cols: 'md:grid-cols-2', span: true };
}

function Cards({ items }: { items: Card[] }) {
  const long = items.some((c) => c.lines.some((l) => stripTags(l.html).length > 170));
  if (long) {
    return (
      <div data-reveal="" data-stagger="">
        {items.map((c, i) => (
          <CardItem key={(c.href ?? '') + i} card={c} variant="row" />
        ))}
      </div>
    );
  }
  const g = gridFor(items.length);
  return (
    <div className={clsx('grid grid-flow-dense grid-cols-1 gap-3', g.cols)} data-reveal="" data-stagger="">
      {items.map((c, i) => (
        <div key={(c.href ?? '') + i} className={clsx('flex *:flex-1', g.span && i === 0 && 'md:col-span-2')}>
          <CardItem card={c} variant="tile" />
        </div>
      ))}
    </div>
  );
}

export function BlockView({ block, next, dense }: { block: Block; next?: Block; dense?: boolean }) {
  switch (block.t) {
    case 'h':
      return block.level <= 2 ? (
        <div data-reveal="">
          <Html as="h2" html={block.html} className="headline mt-6 text-ink" />
        </div>
      ) : (
        <div data-reveal="">
          <Html as="h3" html={block.html} className="title-lg mt-4 text-ink" />
        </div>
      );
    case 'p':
    case 'span':
      if (next && isLabel(block.html) && next.t !== 'h') {
        return (
          <p className="eyebrow pt-4" data-reveal="">
            {stripTags(block.html)}
          </p>
        );
      }
      return (
        <div data-reveal="">
          <Html as="p" html={block.html} className={clsx('inline-links text-pretty leading-relaxed text-[#424245]', dense ? 'text-[1.05rem]' : 'text-[1.15rem] md:text-[1.2rem]')} />
        </div>
      );
    case 'quote':
      return (
        <figure className="relative my-4 border-l-2 border-ink pl-6" data-reveal="">
          <Html as="blockquote" html={block.html} className="inline-links text-[1.25rem] leading-relaxed tracking-[-0.015em] text-ink" />
        </figure>
      );
    case 'list': {
      const chips = block.items.every((i) => stripTags(i).split(/\s+/).length <= 3 && !i.includes('<a'));
      if (chips) {
        return (
          <ul className="flex flex-wrap gap-2" data-reveal="" data-stagger="">
            {block.items.map((it) => (
              <li key={it} className="rounded-full bg-surface px-4 py-2 text-[0.95rem] text-ink ring-1 ring-inset ring-black/[0.07]">
                <Html html={it} />
              </li>
            ))}
          </ul>
        );
      }
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag className="divide-y divide-line border-y border-line" data-reveal="" data-stagger="">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-5 py-4 text-[1.05rem] leading-relaxed text-[#424245]">
              <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-ink/70" />
              <Html html={it} className="inline-links" />
            </li>
          ))}
        </Tag>
      );
    }
    case 'steps':
      return (
        <ol className="flex flex-wrap gap-3" data-reveal="" data-stagger="">
          {block.items.map((s, i) => (
            <li key={i} className="relative flex min-h-[170px] flex-[1_1_240px] flex-col justify-between rounded-[1.5rem] bg-surface p-6 ring-1 ring-inset ring-black/[0.05]">
              <span className="font-mono text-[0.75rem] tracking-[0.08em] text-faint">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[1.12rem] font-medium leading-snug tracking-[-0.02em] text-ink">{s}</span>
            </li>
          ))}
        </ol>
      );
    case 'stats':
      return (
        <dl className={clsx('grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] bg-line ring-1 ring-inset ring-black/[0.05]', dense ? '' : block.items.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3')} data-reveal="">
          {block.items.map((s) => (
            <div key={s.label} className="flex flex-col gap-2 bg-surface p-6 md:p-8">
              <dd className="text-[clamp(2.2rem,3.6vw,3.2rem)] font-semibold leading-none tracking-[-0.05em] text-ink tabular-nums" data-count={s.value}>
                {s.value}
              </dd>
              <dt className="text-[0.92rem] text-muted">{s.label}</dt>
            </div>
          ))}
        </dl>
      );
    case 'cards':
      return <Cards items={block.items} />;
    case 'faq':
      return <Faq items={block.items} />;
    case 'table':
      return (
        <div className="-mx-1 overflow-x-auto rounded-[1.25rem] ring-1 ring-inset ring-black/[0.06]" data-reveal="">
          <table className="w-full min-w-[560px] border-collapse bg-surface text-left text-[0.95rem]">
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-line last:border-0">
                  {row.map((cell, ci) =>
                    cell.head ? (
                      <th key={ci} className="bg-canvas px-5 py-4 font-medium text-ink">
                        <Html html={cell.html} />
                      </th>
                    ) : (
                      <td key={ci} className="px-5 py-4 align-top text-[#424245]">
                        <Html html={cell.html} className="inline-links" />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'code':
      return (
        <pre className="overflow-x-auto rounded-2xl bg-night p-6 font-mono text-[0.85rem] text-white/80" data-reveal="">
          {block.text}
        </pre>
      );
    case 'link':
      return (
        <div data-reveal="">
          <Button href={block.href} variant="secondary">
            {block.label}
          </Button>
        </div>
      );
    case 'actions':
      return (
        <div className="flex flex-wrap gap-3" data-reveal="">
          {block.items.map((a, i) => (
            <Button key={a.href + a.label} href={a.href} variant={i === 0 ? 'primary' : 'secondary'} arrow={i === 0}>
              {a.label}
            </Button>
          ))}
        </div>
      );
    case 'form':
      return <ContactForm fields={block.fields} notes={block.notes} />;
  }
}

export default function BlockRenderer({ blocks, dense }: { blocks: Block[]; dense?: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} next={blocks[i + 1]} dense={dense} />
      ))}
    </div>
  );
}
