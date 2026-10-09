import Link from 'next/link';
import { PLATFORMS } from '@/lib/platforms';
import PlatformIcon from '@/components/ui/PlatformIcon';

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      <section className="relative pt-16 pb-12 text-center sm:pt-24 sm:pb-16">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-accent-pink-soft px-4 py-1.5 text-sm font-semibold text-ink shadow-brutal-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent-pink" />
          Gratis & tanpa watermark
        </div>

        <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl md:text-6xl">
          Download Video{' '}
          <span className="relative inline-block text-brand">
            Tanpa Watermark
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 200 12"
              fill="none"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <path
                d="M2 9C60 3 140 3 198 8"
                stroke="#F6AD55"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-ink-secondary sm:text-lg">
          Tempel link dari TikTok, YouTube, Instagram, Twitter/X, Facebook, dan
          lainnya — pilih resolusi, lalu download dalam hitungan detik.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/tiktok-downloader"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border-2 border-ink bg-accent-yellow px-6 text-base font-bold text-ink shadow-brutal transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            <PlatformIcon id="tiktok" size={20} />
            TikTok Downloader
          </Link>
          <Link
            href="/youtube-downloader"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border-2 border-ink bg-surface px-6 text-base font-bold text-ink shadow-brutal transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            <PlatformIcon id="youtube" size={20} className="text-[#F56565]" />
            YouTube Downloader
          </Link>
        </div>
      </section>

      {/* Platform grid */}
      <section className="pb-20">
        <div className="mb-8 flex items-center gap-3">
          <h2 className="font-display text-2xl font-bold text-ink">
            Pilih Platform
          </h2>
          <div className="h-1 flex-1 rounded-full bg-surface-muted" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORMS.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="group rounded-lg border-2 border-ink bg-surface p-6 shadow-brutal transition-all duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-sm"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-md border-2 border-ink shadow-brutal-sm"
                style={{ backgroundColor: p.soft, color: p.color }}
              >
                <PlatformIcon id={p.id} size={26} />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-ink">
                {p.name}
              </h3>
              <p className="mt-1.5 text-sm text-ink-muted">{p.description}</p>
              <div
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold transition group-hover:gap-2.5"
                style={{ color: p.color }}
              >
                Mulai download
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
