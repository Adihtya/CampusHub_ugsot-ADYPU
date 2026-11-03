import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Header from '@/components/Header';
import ProfileFab from '@/components/ProfileFab';
import './globals.css';

export const metadata: Metadata = {
  title: 'UGSOTADYPU Hub',
  description: 'Events, people and conversations on campus, all in one place.',
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
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=DM+Sans:wght@300;400;500;700&display=swap"
        />
      </head>
      <body>
        <Header />
        {children}
        <ProfileFab />
      </body>
    </html>
  );
}
