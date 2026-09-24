import { pages, stripTags, type Block, type Card, type Section } from './content';

const home = pages['/'];
const find = (needle: string): Section => {
  const s = home.sections.find((x) => (x.heading ?? '').includes(needle) || x.blocks.some((b) => 'html' in b && b.html.includes(needle)));
  if (!s) throw new Error(`Home section not found: ${needle}`);
  return s;
};
const cardsOf = (s: Section): Card[] => s.blocks.filter((b): b is Extract<Block, { t: 'cards' }> => b.t === 'cards').flatMap((b) => b.items);
const firstP = (s: Section) => (s.blocks.find((b) => b.t === 'p') as { html: string } | undefined)?.html ?? '';
const line = (c: Card, i: number) => stripTags(c.lines[i]?.html ?? '');
const dedupe = (cards: Card[]) => cards.filter((c, i) => cards.findIndex((d) => d.title === c.title) === i);

const heroS = home.sections[0];
const trustS = find('Trusted by');
const servicesS = find('Technology Solutions Built For Growth');
const whyS = find('Why Businesses Choose Ryzoe');
const casesS = find('Delivery stories from the field');
const productsS = find('Products We Build');
const processS = find('Our Development Process');
const insightsS = find('Technical guides for decision-makers');
const industriesS = find('Industries We Serve');
const ctaS = find('Ready To Build Something Great?');

export const homeContent = {
  hero: {
    eyebrow: 'Software & AI · Sri Lanka',
    title: stripTags((heroS.blocks.find((b) => b.t === 'h') as { html: string }).html),
    lead: firstP(heroS),
    actions: (heroS.blocks.find((b) => b.t === 'actions') as Extract<Block, { t: 'actions' }>).items,
    stats: (heroS.blocks.find((b) => b.t === 'list') as Extract<Block, { t: 'list' }>).items.map((s) => {
      const m = stripTags(s).match(/^([\d+]+)\s+(.*)$/)!;
      return { value: m[1], label: m[2] };
    }),
  },
  trust: {
    text: firstP(trustS),
    segments: (trustS.blocks.find((b) => b.t === 'list') as Extract<Block, { t: 'list' }>).items.map(stripTags),
  },
  services: {
    eyebrow: servicesS.eyebrow!,
    heading: stripTags(servicesS.heading!),
    lead: firstP(servicesS),
    items: cardsOf(servicesS).map((c) => {
      const featured = stripTags(c.lines[0]?.html ?? '') === 'Featured';
      return { title: c.title!, href: c.href!, featured, text: line(c, featured ? 1 : 0), cta: featured ? line(c, 2) : '' };
    }),
  },
  why: {
    eyebrow: whyS.eyebrow!,
    heading: stripTags(whyS.heading!),
    items: cardsOf(whyS).map((c) => ({ title: c.title!, text: line(c, 0) })),
  },
  cases: {
    eyebrow: casesS.eyebrow!,
    heading: stripTags(casesS.heading!),
    lead: firstP(casesS),
    items: cardsOf(casesS).map((c) => ({ title: c.title!, href: c.href!, text: line(c, 0), outcome: line(c, 1), cta: line(c, 2) })),
  },
  products: {
    eyebrow: productsS.eyebrow!,
    heading: stripTags(productsS.heading!),
    items: cardsOf(productsS).map((c) => ({ title: c.title!, href: c.href!, text: line(c, 0), cta: line(c, 1) })),
  },
  process: {
    eyebrow: processS.eyebrow!,
    heading: stripTags(processS.heading!),
    lead: firstP(processS),
    items: dedupe(cardsOf(processS)).map((c) => ({ index: line(c, 0), title: c.title!, text: line(c, 1) })),
  },
  insights: {
    eyebrow: insightsS.eyebrow!,
    heading: stripTags(insightsS.heading!),
    lead: firstP(insightsS),
    items: cardsOf(insightsS).map((c) => ({ title: c.title!, href: c.href!, category: line(c, 0), text: line(c, 1), cta: line(c, 2) })),
  },
  industries: {
    eyebrow: industriesS.eyebrow!,
    heading: stripTags(industriesS.heading!),
    lead: firstP(industriesS),
    items: cardsOf(industriesS).map((c) => ({ title: c.title!, text: line(c, 0), tags: line(c, 1) })),
    note: (industriesS.blocks.filter((b) => b.t === 'p').at(-1) as { html: string }).html,
  },
  cta: { heading: stripTags(ctaS.heading!), text: firstP(ctaS) },
};
