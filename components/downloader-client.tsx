'use client';

import { useState } from 'react';
import type { PlatformConfig } from '@/lib/platforms';
import Button from '@/components/ui/Button';
import PlatformIcon from '@/components/ui/PlatformIcon';

export interface VideoFormat {
  formatId: string;
  ext: string;
  resolution?: string;
  fps?: number;
  filesize?: number;
  filesizeApprox?: number;
  hasVideo: boolean;
  hasAudio: boolean;
}

export interface SlideImage {
  url: string;
  width?: number;
  height?: number;
}

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration?: number;
  uploader?: string;
  extractor: string;
  formats: VideoFormat[];
  slides: SlideImage[];
  isSlideshow: boolean;
}

export function formatBytes(bytes?: number): string {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(1)} ${units[i]}`;
}

export function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function triggerDownload(url: string, filename?: string) {
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  if (filename) a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function DownloaderClient({
  platform,
}: {
  platform: PlatformConfig;
}) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'foto' | 'video'>('video');
  const [downloading, setDownloading] = useState<string | null>(null);

  async function handleFetch() {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setInfo(null);

    try {
      const res = await fetch(`/api/info?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan.');
      setInfo(data);
      if (data.isSlideshow) setTab('foto');
      else setTab('video');
    } catch (e: any) {
      setError(e.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadVideo(format: VideoFormat) {
    setDownloading(format.formatId);
    setError('');

    // Build download URL. For audio-only use `audio=1`; for video pass height.
    const params = new URLSearchParams({ url: url.trim() });
    if (!format.hasVideo && format.hasAudio) {
      params.set('audio', '1');
    } else {
      const height = parseInt(format.resolution ?? '0', 10);
      if (height > 0) params.set('height', String(height));
    }
    triggerDownload(`/api/download?${params.toString()}`);
    setDownloading(null);
  }

  async function handleDownloadSlide(slide: SlideImage, idx: number) {
    setDownloading(`slide-${idx}`);
    try {
      triggerDownload(slide.url, `${info?.title ?? 'foto'}-${idx + 1}.jpg`);
    } finally {
      setDownloading(null);
    }
  }

  const videoFormats =
    info?.formats.filter((f) => f.hasVideo && f.resolution !== 'audio') ?? [];
  const audioFormat = info?.formats.find((f) => !f.hasVideo && f.hasAudio);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <a
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition hover:text-brand"
      >
        ← Kembali ke Beranda
      </a>

      <header className="mb-8 text-center">
        <div
          className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-md border-2 border-ink shadow-brutal-sm"
          style={{ backgroundColor: platform.soft, color: platform.color }}
        >
          <PlatformIcon id={platform.id} size={28} />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {platform.name}{' '}
          <span style={{ color: platform.color }}>Downloader</span>
        </h1>
        <p className="mt-3 text-ink-secondary">{platform.description}</p>
      </header>

      {/* URL input */}
      <div className="rounded-lg border-2 border-ink bg-surface p-4 shadow-brutal">
        <label
          htmlFor="video-url"
          className="mb-2 block text-sm font-semibold text-ink-secondary"
        >
          Tempel link video
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="video-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
            placeholder={platform.placeholder}
            className="h-12 w-full flex-1 rounded-md border-2 border-surface-border bg-surface px-4 text-ink placeholder:text-ink-muted outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
          />
          <Button
            onClick={handleFetch}
            disabled={loading || !url.trim()}
            loading={loading}
            size="large"
            className="shrink-0"
          >
            {loading ? 'Memproses' : 'Submit'}
          </Button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-md border-2 border-semantic-error bg-semantic-error-bg px-4 py-3 text-sm font-medium text-semantic-error"
        >
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-8 animate-pulse rounded-lg border-2 border-ink bg-surface p-6 shadow-brutal">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="h-28 w-full rounded-md bg-surface-muted sm:w-44" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-3/4 rounded bg-surface-muted" />
              <div className="h-4 w-1/2 rounded bg-surface-muted" />
            </div>
          </div>
        </div>
      )}

      {info && !loading && (
        <section className="mt-8 animate-fade-in">
          <div className="rounded-lg border-2 border-ink bg-surface p-6 shadow-brutal">
            <div className="flex flex-col gap-5 sm:flex-row">
              {info.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={info.thumbnail}
                  alt={info.title}
                  className="h-40 w-full rounded-md border-2 border-ink object-cover sm:w-56"
                />
              )}
              <div className="flex-1">
                <h2 className="font-display text-lg font-bold leading-snug text-ink">
                  {info.title}
                </h2>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
                  {info.uploader && <span>👤 {info.uploader}</span>}
                  {info.duration && (
                    <span>⏱ {formatDuration(info.duration)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Slideshow: Foto / Video menu */}
          {platform.supportsSlideshow && info.isSlideshow && (
            <div className="mt-6">
              <div className="mb-4 flex gap-2 rounded-md border-2 border-ink bg-surface p-1 shadow-brutal-sm">
                <button
                  onClick={() => setTab('foto')}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-bold transition ${
                    tab === 'foto'
                      ? 'bg-brand text-white'
                      : 'text-ink-secondary hover:bg-surface-muted'
                  }`}
                >
                  📷 Foto ({info.slides.length})
                </button>
                <button
                  onClick={() => setTab('video')}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-bold transition ${
                    tab === 'video'
                      ? 'bg-brand text-white'
                      : 'text-ink-secondary hover:bg-surface-muted'
                  }`}
                >
                  🎬 Video
                </button>
              </div>

              {tab === 'foto' && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {info.slides.map((slide, idx) => (
                    <div
                      key={slide.url}
                      className="overflow-hidden rounded-md border-2 border-ink bg-surface shadow-brutal-sm"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.url}
                        alt={`Foto ${idx + 1}`}
                        className="h-40 w-full object-cover"
                      />
                      <button
                        onClick={() => handleDownloadSlide(slide, idx)}
                        disabled={downloading === `slide-${idx}`}
                        className="w-full bg-brand px-3 py-2 text-sm font-bold text-white transition hover:bg-brand-hover disabled:opacity-60"
                      >
                        {downloading === `slide-${idx}`
                          ? 'Menyiapkan…'
                          : 'Download Foto'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'video' && (
                <VideoFormatList
                  videoFormats={videoFormats}
                  audioFormat={audioFormat}
                  downloading={downloading}
                  onDownload={handleDownloadVideo}
                />
              )}
            </div>
          )}

          {/* Normal video */}
          {!platform.supportsSlideshow || !info.isSlideshow ? (
            <div className="mt-6">
              <VideoFormatList
                videoFormats={videoFormats}
                audioFormat={audioFormat}
                downloading={downloading}
                onDownload={handleDownloadVideo}
              />
            </div>
          ) : null}
        </section>
      )}
    </main>
  );
}

function VideoFormatList({
  videoFormats,
  audioFormat,
  downloading,
  onDownload,
}: {
  videoFormats: VideoFormat[];
  audioFormat?: VideoFormat;
  downloading: string | null;
  onDownload: (f: VideoFormat) => void;
}) {
  return (
    <div>
      <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-ink-secondary">
        Pilih kualitas video
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {videoFormats.map((f) => (
          <button
            key={f.formatId}
            onClick={() => onDownload(f)}
            disabled={downloading === f.formatId}
            className="group rounded-md border-2 border-ink bg-surface p-4 text-left shadow-brutal-sm transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-60"
          >
            <div className="font-display text-lg font-bold text-ink">
              {f.resolution ?? 'Video'}
            </div>
            <div className="mt-1 text-xs text-ink-muted">
              {f.ext.toUpperCase()}
              {f.filesize || f.filesizeApprox
                ? ` · ${formatBytes(f.filesize ?? f.filesizeApprox)}`
                : ''}
            </div>
            <div className="mt-2 text-xs font-bold text-brand">
              {downloading === f.formatId ? 'Menyiapkan…' : 'Download ↓'}
            </div>
          </button>
        ))}
      </div>

      {audioFormat && (
        <>
          <h3 className="mb-3 mt-6 font-display text-sm font-bold uppercase tracking-wide text-ink-secondary">
            Audio saja (MP3)
          </h3>
          <button
            onClick={() => onDownload(audioFormat)}
            disabled={downloading === audioFormat.formatId}
            className="w-full rounded-md border-2 border-ink bg-accent-pink-soft p-4 text-left shadow-brutal-sm transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-60"
          >
            <div className="font-display text-base font-bold text-ink">
              🎵 Ekstrak MP3 / Audio
            </div>
            <div className="mt-1 text-xs text-ink-muted">
              {audioFormat.ext.toUpperCase()} ·{' '}
              {formatBytes(audioFormat.filesize)}
            </div>
          </button>
        </>
      )}
    </div>
  );
}
 