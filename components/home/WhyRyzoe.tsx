import SectionHeader from '@/components/blocks/SectionHeader';
import ScrubText from '@/components/motion/ScrubText';
import { homeContent } from '@/lib/home';

export default function WhyRyzoe() {
  const { why } = homeContent;
  return (
    <section className="bg-surface py-32 md:py-48">
      <div className="shell">
        <SectionHeader eyebrow={why.eyebrow} heading={why.heading} />
        <ol className="mt-16 md:mt-24">
          {why.items.map((item) => (
            <li key={item.title} className="group grid gap-4 border-t border-line py-10 md:grid-cols-12 md:gap-10 md:py-14">
              <ScrubText
                as="h3"
                segments={[{ text: item.title }]}
                className="text-[clamp(1.9rem,3.6vw,3.3rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-ink md:col-span-7"
              />
              <p className="max-w-md self-end text-[1.05rem] leading-relaxed text-muted md:col-span-5 md:justify-self-end" data-reveal="">
                {item.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
