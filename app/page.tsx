import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import TrustBand from '@/components/home/TrustBand';
import ServicesBento from '@/components/home/ServicesBento';
import WhyRyzoe from '@/components/home/WhyRyzoe';
import CaseStack from '@/components/home/CaseStack';
import ProductAccordion from '@/components/home/ProductAccordion';
import ProcessPinned from '@/components/home/ProcessPinned';
import Insights from '@/components/home/Insights';
import Industries from '@/components/home/Industries';
import CtaChapter from '@/components/blocks/CtaChapter';
import { homeContent } from '@/lib/home';
import { pages } from '@/lib/content';

export const metadata: Metadata = { title: pages['/'].title, description: pages['/'].description };

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBand />
      <ServicesBento />
      <WhyRyzoe />
      <CaseStack />
      <ProductAccordion />
      <ProcessPinned />
      <Insights />
      <Industries />
      <CtaChapter heading={homeContent.cta.heading} text={homeContent.cta.text} actions={[{ label: 'Start Your Project', href: '/contact' }]} />
    </>
  );
}
