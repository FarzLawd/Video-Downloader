import Link from 'next/link';
import { PLATFORMS } from '@/lib/platforms';
import PlatformIcon from '@/components/ui/PlatformIcon';

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-surface-secondary">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-xl font-bold text-ink"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-ink bg-brand text-white shadow-brutal-sm">
                G
              </span>
              Grab<span className="text-brand">Vid</span>
            </Link>
            <p className="mt-3 text-sm text-ink-muted">
              Download video tanpa watermark dari platform favoritmu, gratis dan
              cepat.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-secondary">
              Platform
            </h3>
            <ul className="mt-3 space-y-2">
              {PLATFORMS.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.slug}`}
                    className="flex items-center gap-2 text-sm text-ink-muted transition hover:text-brand"
                  >
                    <PlatformIcon id={p.id} size={16} className="shrink-0" />
                    {p.name} Downloader
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="max-w-xs">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-secondary">
              Disclaimer
            </h3>
            <p className="mt-3 text-sm text-ink-muted">
              Gunakan alat ini hanya untuk konten yang Anda miliki atau miliki
              izin untuk mengunduhnya, sesuai ketentuan layanan masing-masing
              platform.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-surface-border pt-6 text-center text-xs text-ink-muted">
          © {new Date().getFullYear()} GrabVid. Dibuat dengan ❤️ untuk
          pengunduh video.
        </div>
      </div>
    </footer>
  );
}
