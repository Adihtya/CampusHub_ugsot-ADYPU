'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { basePath } from '@/lib/site';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/students', label: 'Students' },
  { href: '/community', label: 'Community' },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="logo" onClick={() => setIsOpen(false)}>
          <Image
            src={`${basePath}/upgrad-sot-logo.png`}
            alt="upGrad"
            className="logo__image"
            width={175}
            height={56}
            priority
          />
          <span className="logo__club">DEV CLUB</span>
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          <span /><span />
        </button>
        <nav aria-label="Main" className={`nav ${isOpen ? 'nav--open' : ''}`}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav__link"
              aria-current={
                item.href === '/'
                  ? pathname === '/' ? 'page' : undefined
                  : pathname === item.href || pathname.startsWith(`${item.href}/`) ? 'page' : undefined
              }
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/students" className="nav__cta" onClick={() => setIsOpen(false)}>Join the club <span>↗</span></Link>
        </nav>
      </div>
    </header>
  );
}
