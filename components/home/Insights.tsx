import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import SectionHeader from '@/components/blocks/SectionHeader';
import SpotCard from '@/components/ui/SpotCard';
import Button from '@/components/ui/Button';
import { homeContent } from '@/lib/home';

export default function Insights() {
  const { insights } = homeContent;
  return (
    <section className="bg-canvas py-32 md:py-48">
      <div className="shell">
        <SectionHeader
          eyebrow={insights.eyebrow}
          heading={insights.heading}
          lead={insights.lead}
          aside={
            <Button href="/blog" variant="secondary">
              Browse all articles
            </Button>
          }
        />
        <div className="mt-16 grid gap-3 md:grid-cols-3" data-reveal="" data-stagger="">
          {insights.items.map((a) => (
            <SpotCard key={a.href} href={a.href} tilt className="bg-surface ring-1 ring-inset ring-black/[0.05] hover:shadow-[0_30px_70px_-30px_rgba(0,0,0,0.2)]">
              <article className="relative flex h-full min-h-[360px] flex-col justify-between p-8">
                <p className="eyebrow">{a.category}</p>
                <div>
                  <h3 className="text-[1.45rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink">{a.title}</h3>
                  <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">{a.text}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-[0.92rem] font-medium text-ink">
                    {a.cta}
                    <ArrowUpRight weight="bold" className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </article>
            </SpotCard>
          ))}
        </div>
      </div>
    </section>
  );
}
