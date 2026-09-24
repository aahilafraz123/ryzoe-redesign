import SectionHeader from '@/components/blocks/SectionHeader';
import Html from '@/components/ui/Html';
import { homeContent } from '@/lib/home';

/** Inline typography object: a tiny living orb set into the heading. */
const Orb = (
  <span
    aria-hidden
    className="relative ml-[0.22em] inline-block h-[0.72em] w-[1.6em] -translate-y-[0.04em] overflow-hidden rounded-full align-middle"
  >
    <span
      className="absolute left-1/2 top-1/2 size-[3em] -translate-x-1/2 -translate-y-1/2"
      style={{ background: 'conic-gradient(from 180deg at 50% 50%, #2997ff, #7a5cff, #ff375f, #ff9f0a, #34c759, #2997ff)', animation: 'spin-centered 6s linear infinite' }}
    />
    <span className="absolute inset-[2px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.7),transparent_55%)] mix-blend-screen" />
  </span>
);

export default function Industries() {
  const { industries } = homeContent;
  return (
    <section className="bg-surface py-32 md:py-48">
      <div className="shell">
        <SectionHeader eyebrow={industries.eyebrow} heading={industries.heading} lead={industries.lead} insert={{ after: 0, node: Orb }} />
        <ul className="mt-16 md:mt-24">
          {industries.items.map((ind) => (
            <li
              key={ind.title}
              className="group grid gap-3 border-t border-line py-8 transition-colors duration-500 last:border-b md:grid-cols-12 md:items-baseline md:gap-8 md:py-10"
              data-reveal=""
            >
              <h3 className="text-[clamp(1.6rem,2.6vw,2.3rem)] font-semibold tracking-[-0.04em] text-ink transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-2 md:col-span-4">
                {ind.title}
              </h3>
              <p className="text-[1.02rem] leading-relaxed text-muted md:col-span-5">{ind.text}</p>
              <p className="font-mono text-[0.78rem] leading-relaxed tracking-[0.02em] text-faint md:col-span-3 md:text-right">{ind.tags}</p>
            </li>
          ))}
        </ul>
        <div data-reveal="">
          <Html as="p" html={industries.note} className="inline-links mt-12 text-[1.05rem] text-muted" />
        </div>
      </div>
    </section>
  );
}
