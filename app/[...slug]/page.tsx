import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHero from '@/components/blocks/PageHero';
import SectionRenderer from '@/components/blocks/SectionRenderer';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import CtaChapter from '@/components/blocks/CtaChapter';
import ReadingProgress from '@/components/blocks/ReadingProgress';
import { allPaths, getPage, stripTags, type Action, type Section } from '@/lib/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return allPaths()
    .filter((p) => p !== '/')
    .map((p) => ({ slug: p.slice(1).split('/') }));
}

type Params = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage('/' + slug.join('/'));
  return page ? { title: page.title, description: page.description } : {};
}

/** A closing section made only of copy + links becomes the dark CTA chapter. */
function asCta(s: Section | undefined): { heading: string; text?: string; actions: Action[] } | null {
  if (!s?.heading) return null;
  if (!s.blocks.every((b) => b.t === 'p' || b.t === 'link' || b.t === 'actions')) return null;
  const actions: Action[] = s.blocks.flatMap((b) => (b.t === 'link' ? [{ label: b.label, href: b.href }] : b.t === 'actions' ? b.items : []));
  if (!actions.length) return null;
  const text = s.blocks.filter((b) => b.t === 'p').map((b) => (b as { html: string }).html).join(' ');
  return { heading: stripTags(s.heading), text, actions };
}

export default async function InnerPage({ params }: Params) {
  const { slug } = await params;
  const path = '/' + slug.join('/');
  const page = getPage(path);
  if (!page) notFound();

  const isArticle = page.sections.some((s) => s.kind === 'article');
  const cta = asCta(page.sections.at(-1));
  const body = cta ? page.sections.slice(0, -1) : page.sections;

  return (
    <>
      {page.hero && <PageHero hero={page.hero} path={path} article={isArticle} />}

      {body.map((s, i) =>
        s.kind === 'article' ? (
          <section key={i} id="article" className="bg-surface py-20 md:py-28">
            <ReadingProgress target="#article" />
            <div className="shell max-w-[980px]">
              <div className="prose-ryzoe mx-auto max-w-[700px] [&_h2]:!mt-10 [&_h2]:!text-[clamp(1.6rem,2.4vw,2.1rem)]">
                <BlockRenderer blocks={s.blocks} dense />
              </div>
            </div>
          </section>
        ) : (
          <SectionRenderer key={i} section={s} index={i} />
        ),
      )}

      {cta && <CtaChapter heading={cta.heading} text={cta.text} actions={cta.actions} />}
    </>
  );
}
