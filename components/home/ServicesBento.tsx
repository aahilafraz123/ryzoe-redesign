'use client';

import {
  Code,
  Globe,
  DeviceMobile,
  Stack,
  Sparkle,
  FlowArrow,
  Cpu,
  Cloud,
  PenNib,
  ArrowUpRight,
  type Icon,
} from '@phosphor-icons/react';
import SectionHeader from '@/components/blocks/SectionHeader';
import SpotCard from '@/components/ui/SpotCard';
import Button from '@/components/ui/Button';
import { homeContent } from '@/lib/home';

export const SERVICE_ICONS: Record<string, Icon> = {
  'custom-software-development': Code,
  'web-development': Globe,
  'mobile-app-development': DeviceMobile,
  'saas-development': Stack,
  'ai-solutions': Sparkle,
  'business-automation': FlowArrow,
  'iot-smart-solutions': Cpu,
  'cloud-solutions': Cloud,
  'product-design-consulting': PenNib,
};
export const iconFor = (href: string) => SERVICE_ICONS[href.split('/').pop() ?? ''] ?? Code;

/** Layered isometric plates: a small CSS 3D object for the featured tile. */
function LayerStack() {
  return (
    <div aria-hidden className="pointer-events-none absolute right-0 top-4 h-[250px] w-[300px] [perspective:1200px] md:right-4 md:top-6">
      <div className="relative h-full w-full [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-38deg)] transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:[transform:rotateX(50deg)_rotateZ(-28deg)]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="absolute inset-x-10 inset-y-8 [transform-style:preserve-3d]" style={{ transform: `translateZ(${i * 30}px)` }}>
            <div
              className="h-full w-full rounded-[20px] border border-white/15 transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:[transform:translateZ(var(--lift))]"
              style={{
                ['--lift' as string]: `${i * 14}px`,
                background: i === 3 ? 'linear-gradient(135deg, rgba(41,151,255,0.6), rgba(122,92,255,0.4))' : `rgba(255,255,255,${0.05 + i * 0.035})`,
                boxShadow: i === 3 ? '0 0 60px rgba(41,151,255,0.35)' : undefined,
              }}
            >
              {i === 3 && (
                <div className="grid h-full grid-cols-5 content-center gap-2 p-5 opacity-80">
                  {Array.from({ length: 15 }).map((_, k) => (
                    <span key={k} className="h-1.5 rounded-full bg-white/50" style={{ opacity: ((k * 37) % 10) / 10 + 0.2 }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServicesBento() {
  const { services } = homeContent;
  return (
    <section className="bg-canvas pb-32 md:pb-48">
      <div className="shell">
        <SectionHeader
          eyebrow={services.eyebrow}
          heading={services.heading}
          lead={services.lead}
          aside={
            <Button href="/services" variant="secondary">
              View all services
            </Button>
          }
        />

        {/* 4 cols: featured 2x2 (4 cells) + 8 singles = 12 cells = 3 full rows. md: 2 cols -> 6 full rows. */}
        <div className="mt-16 grid grid-flow-dense grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(250px,auto)]" data-reveal="" data-stagger="">
          {services.items.map((s) => {
            const Icon = iconFor(s.href);
            if (s.featured) {
              return (
                <SpotCard key={s.href} href={s.href} className="min-h-[440px] bg-night text-white md:col-span-2 md:row-span-2 lg:min-h-0">
                  <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_100%_100%,rgba(41,151,255,0.28),transparent_60%)]" />
                  <LayerStack />
                  <div className="relative flex h-full flex-col justify-between p-8 md:p-10">
                    <span className="eyebrow !text-white/50">Featured</span>
                    <div className="max-w-sm">
                      <h3 className="text-[clamp(1.9rem,2.8vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.04em]">{s.title}</h3>
                      <p className="mt-4 text-[1.05rem] leading-relaxed text-white/60">{s.text}</p>
                      <span className="mt-8 inline-flex items-center gap-2 text-[0.95rem] font-medium">
                        {s.cta}
                        <ArrowUpRight weight="bold" className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </SpotCard>
              );
            }
            return (
              <SpotCard key={s.href} href={s.href} className="bg-surface ring-1 ring-inset ring-black/[0.05] hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.18)]">
                <div className="relative flex h-full min-h-[230px] flex-col justify-between p-7">
                  <div className="flex items-start justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-canvas text-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-white">
                      <Icon size={20} weight="regular" />
                    </span>
                    <ArrowUpRight className="size-4 -translate-x-1 translate-y-1 text-faint opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" weight="bold" />
                  </div>
                  <div>
                    <h3 className="text-[1.2rem] font-semibold tracking-[-0.025em] text-ink">{s.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{s.text}</p>
                  </div>
                </div>
              </SpotCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
