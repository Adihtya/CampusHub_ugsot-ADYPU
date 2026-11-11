'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/community', label: 'Community' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-4 border-sot-slate bg-sot-navy text-sot-white">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 text-sot-white no-underline"
          onClick={() => setIsOpen(false)}
        >
          <span className="grid h-10 shrink-0 place-items-center border-2 border-sot-slate bg-sot-white px-1 shadow-hard-small">
            <Image
              src="/upgrad-sot-logo.png"
              alt="upGrad"
              width={100}
              height={32}
              priority
            />
          </span>
          <span className="font-display text-sm font-extrabold uppercase leading-tight tracking-wide sm:text-base">
            SOT
            <span className="block font-mono text-[10px] tracking-[0.2em] text-sot-mustard sm:text-xs">
              DEV CLUB
            </span>
          </span>
        </Link>

        <button
          type="button"
          className="grid size-11 shrink-0 place-items-center border-[3px] border-sot-slate bg-sot-mustard text-sot-slate shadow-hard-small md:hidden"
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="font-mono text-xl leading-none">{isOpen ? '×' : '≡'}</span>
        </button>

        <nav
          aria-label="Main navigation"
          className={`${isOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col border-b-4 border-sot-slate bg-sot-navy p-5 shadow-hard md:static md:flex md:flex-row md:items-center md:gap-2 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {links.map(({ href, label }) => {
            const active = href === '/'
              ? pathname === '/'
              : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`border-b-2 px-3 py-3 font-mono text-sm font-bold uppercase tracking-wider no-underline transition-colors hover:border-sot-crimson hover:text-sot-crimson md:border-b-4 md:py-2 ${
                  active ? 'border-sot-mustard text-sot-mustard' : 'border-transparent text-sot-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/community#join"
            className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 border-4 border-sot-slate bg-sot-crimson px-4 font-display text-sm font-extrabold uppercase text-sot-white no-underline shadow-hard-small transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none md:ml-2 md:mt-0"
            onClick={() => setIsOpen(false)}
          >
            Join the club <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
