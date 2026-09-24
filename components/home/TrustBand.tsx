import { homeContent } from '@/lib/home';

export default function TrustBand() {
  const { trust, hero } = homeContent;
  const row = [...trust.segments, ...trust.segments];
  return (
    <section className="relative bg-canvas py-28 md:py-40">
      <div className="shell">
        <p className="mx-auto max-w-3xl text-center text-[clamp(1.4rem,2.4vw,2.1rem)] font-medium leading-[1.25] tracking-[-0.03em] text-ink" data-reveal="">
          {trust.text.replace(/Sri Lanka\.$/, '')}
          <span className="text-muted">Sri Lanka.</span>
        </p>
      </div>

      <div className="marquee relative mt-16 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]" data-reveal="">
        <ul className="marquee-track flex w-max items-center">
          {row.map((s, i) => (
            <li key={i} aria-hidden={i >= trust.segments.length} className="flex items-center">
              <span className="px-8 text-[clamp(2rem,4.2vw,3.6rem)] font-semibold tracking-[-0.045em] text-ink/85 md:px-12">{s}</span>
              <span className="size-1.5 rounded-full bg-ink/20" />
            </li>
          ))}
        </ul>
      </div>

      <div className="shell mt-24 md:mt-32">
        <div className="h-px w-full origin-left bg-line" data-draw="" />
        <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0" data-reveal="" data-stagger="">
          {hero.stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-4 py-8 sm:flex-col sm:gap-2 sm:px-8 sm:first:pl-0">
              <p className=" text-[clamp(3rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.05em] text-ink tabular-nums" data-count={s.value}>
                {s.value}
              </p>
              <p className="text-[0.95rem] text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
