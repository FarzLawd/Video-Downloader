'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/tiktok-downloader', label: 'TikTok' },
  { href: '/youtube-downloader', label: 'YouTube' },
  { href: '/instagram-downloader', label: 'Instagram' },
  { href: '/twitter-downloader', label: 'Twitter/X' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-surface/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-bold text-ink"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-ink bg-brand text-white shadow-brutal-sm">
            G
          </span>
          Grab<span className="text-brand">Vid</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-brand-soft text-ink'
                    : 'text-ink-secondary hover:bg-surface-muted hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:block">
          <Link
            href="/youtube-downloader"
            className="inline-flex h-9 items-center justify-center rounded-md border-2 border-ink bg-accent-yellow px-3 text-sm font-bold text-ink shadow-brutal-sm transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            Download
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu navigasi"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-ink bg-surface text-ink shadow-brutal-sm md:hidden"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t-2 border-ink bg-surface px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === link.href
                    ? 'bg-brand-soft text-ink'
                    : 'text-ink-secondary hover:bg-surface-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
