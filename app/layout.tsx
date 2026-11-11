import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import './globals.css';
import './tailwind.css';

export const metadata: Metadata = {
  title: {
    default: 'upGrad SOT Dev Club',
    template: '%s · upGrad SOT Dev Club',
  },
  description: 'A student-led community at upGrad School of Technology for building, learning, and sharing in public.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&display=swap"
        />
      </head>
      <body className="bg-sot-white font-sans text-sot-slate antialiased">
        <Navbar />
        {children}
        <footer className="border-t-4 border-sot-slate bg-sot-navy text-sot-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-end sm:justify-between md:px-8">
            <div>
              <p className="font-display text-xl font-extrabold uppercase">upGrad SOT Dev Club</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-wider text-sot-mustard">
                Learn in public. Build together.
              </p>
            </div>
            <p className="font-mono text-xs uppercase tracking-wider">Student-built · Community-led</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
