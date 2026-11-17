'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { topNavigationItems } from './navigation';
import type { CurrentUser } from '@/lib/auth';

type Props = {
  currentUser?: CurrentUser | null;
};

export default function NavBar({ currentUser }: Props) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="site-header">
      <div className="container site-header__inner" style={{ justifyContent: 'space-between' }}>
        <Link href="/intro" className="logo" aria-label="Open Source Club intro">
          <span aria-hidden="true" className="logo__mark">U</span>
          <span>UGSOT · ADYPU <span className="logo__accent">Hub</span></span>
        </Link>
        <nav aria-label="Main" className="nav" style={{ alignItems: 'center' }}>
          {topNavigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav__link"
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}

          {/* Profile / Auth Button */}
          {currentUser ? (
            <Link
              href="/profile"
              className="nav__link nav__link--profile"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: isActive('/profile') ? '#FFE066' : '#fff',
                border: '2px solid #1a1a1a',
                borderRadius: 4,
                padding: '0 12px',
                color: '#1a1a1a',
                boxShadow: '2px 2px 0 #1a1a1a',
                marginLeft: 8,
              }}
              title={`Signed in as ${currentUser.name}`}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  display: 'inline-grid',
                  placeItems: 'center',
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {currentUser.name.slice(0, 1).toUpperCase()}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Profile</span>
            </Link>
          ) : (
            <Link
              href="/auth/sign-in"
              className="nav__link nav__link--auth"
              style={{
                backgroundColor: '#1a1a1a',
                color: '#fff',
                border: '2px solid #1a1a1a',
                borderRadius: 4,
                padding: '0 16px',
                fontSize: 13,
                fontWeight: 700,
                boxShadow: '2px 2px 0 #888',
                marginLeft: 8,
              }}
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
