import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import GlassNav from '@/components/layout/GlassNav';
import Footer from '@/components/layout/Footer';
import MotionDirector from '@/components/motion/MotionDirector';
import MadeBy from '@/components/layout/MadeBy';

export const metadata: Metadata = {
  title: 'Ryzoe | Software & AI Solutions — Sri Lanka',
  description:
    "Sri Lanka's Next-Generation Software & AI Solutions Company. Websites, apps, SaaS, AI, cloud, and smart systems for growing businesses.",
  authors: [{ name: 'Aahil Afraz', url: 'https://aahilafraz.com/#/vault' }],
  creator: 'Aahil Afraz',
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/favicon.svg` },
};

export const viewport: Viewport = { themeColor: '#f5f5f7' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <MotionDirector />
        <GlassNav />
        <main id="main" className="w-full max-w-full overflow-x-clip">
          {children}
        </main>
        <Footer />
        <MadeBy />
      </body>
    </html>
  );
}
