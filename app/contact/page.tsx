import type { Metadata } from 'next';
import {
  EnvelopeSimple,
  Phone,
  LinkedinLogo,
  GithubLogo,
  SquaresFour,
  FileArrowDown,
  ArrowUpRight,
} from '@phosphor-icons/react/dist/ssr';
import SplitHeading from '@/components/motion/SplitHeading';
import SpotCard from '@/components/ui/SpotCard';
import ContactForm from '@/components/blocks/ContactForm';
import { AAHIL } from '@/lib/aahil';

export const metadata: Metadata = {
  title: 'Contact | Made by Aahil Afraz',
  description: 'This Ryzoe redesign was designed and built by Aahil Afraz. Get in touch, see more projects, or download the resume.',
};

const FIELDS = [
  { name: 'name', type: 'text', label: 'Name', required: true },
  { name: 'email', type: 'email', label: 'Email', required: true },
  { name: 'company', type: 'text', label: 'Company (optional)', required: false },
  { name: 'website', type: 'text', label: 'Website', required: false },
  { name: 'message', type: 'textarea', label: 'Message', required: true },
];

const TILE = 'bg-surface ring-1 ring-inset ring-black/[0.05] hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(0,0,0,0.22)]';

function Tile({ href, icon, label, value, external, download, className }: { href: string; icon: React.ReactNode; label: string; value: string; external?: boolean; download?: boolean; className?: string }) {
  return (
    <SpotCard href={null} className={`${TILE} ${className ?? ''}`}>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        {...(download ? { download: 'Aahil_Afraz_Resume.pdf' } : {})}
        className="relative flex h-full min-h-[210px] flex-col justify-between p-7 md:p-8"
      >
        <div className="flex items-start justify-between">
          <span className="grid size-11 place-items-center rounded-2xl bg-canvas text-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-white">{icon}</span>
          <ArrowUpRight weight="bold" className="size-4 text-faint transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
        </div>
        <div>
          <p className="eyebrow mb-2">{label}</p>
          <p className="break-words text-[1.25rem] font-semibold tracking-[-0.03em] text-ink">{value}</p>
        </div>
      </a>
    </SpotCard>
  );
}

export default function ContactPage() {
  return (
    <>
      <section data-nav="dark" className="relative isolate overflow-hidden bg-black pb-24 pt-40 text-white md:pb-32 md:pt-52">
        <div aria-hidden className="absolute left-1/2 top-1/3 -z-10 size-[70vmin] -translate-x-1/2 rounded-full bg-[#2997ff]/20 blur-[140px] [animation:drift_16s_ease-in-out_infinite]" />
        <div aria-hidden className="absolute right-[10%] top-1/2 -z-10 size-[40vmin] rounded-full bg-[#7a5cff]/20 blur-[120px] [animation:drift_20s_ease-in-out_infinite_reverse]" />
        <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />
        <div className="shell">
          <p className="eyebrow mb-8 !text-white/50" data-reveal="" data-immediate="" data-delay="0.05">
            You found the easter egg
          </p>
          <SplitHeading as="h1" text="Made by Aahil." immediate className="display text-white" />
          <p className="lede mt-8 max-w-2xl !text-white/65" data-reveal="" data-immediate="" data-delay="0.5">
            This Ryzoe redesign is an independent concept by {AAHIL.name}. Every page, animation and 3D scene was designed and engineered by me, and every word of Ryzoe&apos;s content was carried over. If you like what you see, let&apos;s talk.
          </p>
          <div className="mt-10 flex flex-wrap gap-3" data-reveal="" data-immediate="" data-delay="0.7">
            <a href={`mailto:${AAHIL.email}`} className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[0.95rem] font-medium text-ink transition-colors hover:bg-white/90">
              Email me <ArrowUpRight weight="bold" className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a href={AAHIL.resume} download="Aahil_Afraz_Resume.pdf" className="group inline-flex h-12 items-center gap-2 rounded-full bg-white/5 px-6 text-[0.95rem] font-medium text-white ring-1 ring-inset ring-white/20 backdrop-blur transition-colors hover:bg-white/10 hover:ring-white/40">
              Download resume <FileArrowDown weight="bold" className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-canvas py-24 md:py-32">
        <div className="shell">
          {/* 4 cols: email 2 + resume 2 (row 1), four singles (row 2) = 8 cells, no gaps. */}
          <div className="grid grid-flow-dense grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" data-reveal="" data-stagger="">
            <Tile className="sm:col-span-2" href={`mailto:${AAHIL.email}`} icon={<EnvelopeSimple size={20} />} label="Email" value={AAHIL.email} />
            <SpotCard href={null} className="bg-night text-white sm:col-span-2">
              <a href={AAHIL.resume} download="Aahil_Afraz_Resume.pdf" className="relative flex h-full min-h-[210px] flex-col justify-between p-7 md:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_100%_100%,rgba(41,151,255,0.3),transparent_60%)]" />
                <div className="relative flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-2xl bg-white/10 text-white"><FileArrowDown size={20} /></span>
                  <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[0.7rem] text-white/70">PDF</span>
                </div>
                <div className="relative">
                  <p className="eyebrow mb-2 !text-white/50">Resume</p>
                  <p className="text-[1.6rem] font-semibold tracking-[-0.035em]">Download my resume</p>
                </div>
              </a>
            </SpotCard>
            <Tile href={AAHIL.phoneHref} icon={<Phone size={20} />} label="Phone" value={AAHIL.phone} />
            <Tile href={AAHIL.linkedin} external icon={<LinkedinLogo size={20} />} label="LinkedIn" value="Aahil Afraz" />
            <Tile href={AAHIL.github} external icon={<GithubLogo size={20} />} label="GitHub" value="aahilafraz123" />
            <Tile href={AAHIL.vault} external icon={<SquaresFour size={20} />} label="Project vault" value="All my projects" />
          </div>
        </div>
      </section>

      <section className="bg-surface py-24 md:py-36">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow mb-5" data-reveal="">Or leave a note</p>
              <SplitHeading text="Tell me what you're building." className="headline text-ink" />
              <p className="lede mt-6" data-reveal="">
                The form opens your email app with everything filled in, addressed straight to me.
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm fields={FIELDS} to={AAHIL.email} />
          </div>
        </div>
      </section>
    </>
  );
}
