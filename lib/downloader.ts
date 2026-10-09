import YTDlpWrap from 'yt-dlp-wrap';
import path from 'path';
import fs from 'fs';

/**
 * Locate the yt-dlp binary.
 * - Locally: uses the `yt-dlp` binary on PATH (install via `pip install yt-dlp`
 *   or download from https://github.com/yt-dlp/yt-dlp/releases).
 * - On Vercel: expects the binary to be bundled under /bin/yt-dlp (see README).
 */
function resolveBinaryPath(): string {
  const platform = process.platform;
  const exe = platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';

  // Prefer an explicitly bundled binary if it exists.
  const candidates = [
    path.join(process.cwd(), 'bin', exe),
    path.join('/tmp', exe),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // Fall back to PATH.
  return exe;
}

const ytDlpWrap = new YTDlpWrap(resolveBinaryPath());

export interface VideoFormat {
  formatId: string;
  ext: string;
  resolution?: string;
  fps?: number;
  filesize?: number;
  filesizeApprox?: number;
  tbr?: number;
  vcodec?: string;
  acodec?: string;
  hasVideo: boolean;
  hasAudio: boolean;
}

export interface SlideImage {
  url: string;
  width?: number;
  height?: number;
  filesize?: number;
}

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration?: number;
  uploader?: string;
  uploadDate?: string;
  extractor: string;
  webpageUrl: string;
  formats: VideoFormat[];
  /** Populated when the link is a TikTok photo slideshow. */
  slides: SlideImage[];
  isSlideshow: boolean;
}

export interface DownloadLink {
  url: string;
  ext: string;
  resolution?: string;
  filesize?: number;
}

/** Validate a user-provided URL. */
export function isValidUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function isImageUrl(url: string): boolean {
  return /\.(jpe?g|png|webp|gif|heic|avif)(\?|$)/i.test(url);
}

/**
 * Extract slide images from a TikTok photo slideshow.
 * yt-dlp reports these as a playlist whose entries point to image files.
 */
function extractSlides(raw: any): SlideImage[] {
  const slides: SlideImage[] = [];

  const collect = (entry: any) => {
    const candidateUrls: string[] = [];

    if (typeof entry.url === 'string' && isImageUrl(entry.url)) {
      candidateUrls.push(entry.url);
    }
    if (Array.isArray(entry.formats)) {
      for (const f of entry.formats) {
        if (typeof f.url === 'string' && isImageUrl(f.url)) {
          candidateUrls.push(f.url);
        }
      }
    }
    if (Array.isArray(entry.thumbnails)) {
      for (const t of entry.thumbnails) {
        if (typeof t.url === 'string' && isImageUrl(t.url)) {
          candidateUrls.push(t.url);
        }
      }
    }

    for (const url of candidateUrls) {
      if (!slides.some((s) => s.url === url)) {
        slides.push({
          url,
          width: entry.width ?? undefined,
          height: entry.height ?? undefined,
          filesize: entry.filesize ?? undefined,
        });
      }
    }
  };

  if (Array.isArray(raw.entries)) {
    raw.entries.forEach(collect);
  } else if (raw._type === 'playlist' && Array.isArray(raw.entries)) {
    raw.entries.forEach(collect);
  }

  return slides;
}

/** Fetch rich metadata + available formats for a URL. */
export async function getVideoInfo(url: string): Promise<VideoInfo> {
  const args = [
    '-J',
    '--no-warnings',
    '--no-check-certificates',
    '--skip-download',
    '--no-playlist',
    url,
  ];

  const output = await ytDlpWrap.execPromise(args);
  const raw = JSON.parse(output) as Record<string, any>;

  const allFormats: VideoFormat[] = (raw.formats ?? [])
    .filter((f: any) => f.vcodec !== 'none' || f.acodec !== 'none')
    .map((f: any) => ({
      formatId: f.format_id ?? '',
      ext: f.ext ?? '',
      resolution:
        f.vcodec !== 'none' && f.height
          ? `${f.height}p`
          : f.vcodec === 'none'
            ? 'audio'
            : 'video',
      fps: f.fps ?? undefined,
      filesize: f.filesize ?? undefined,
      filesizeApprox: f.filesize_approx ?? undefined,
      tbr: f.tbr ?? undefined,
      vcodec: f.vcodec ?? undefined,
      acodec: f.acodec ?? undefined,
      hasVideo: f.vcodec !== 'none',
      hasAudio: f.acodec !== 'none',
    }))
    .sort((a: VideoFormat, b: VideoFormat) => (b.tbr ?? 0) - (a.tbr ?? 0));

  // Deduplicate: keep ONE best format per resolution+ext combination,
  // preferring progressive (video+audio) formats so the file plays with sound.
  const formats: VideoFormat[] = [];
  const seen = new Set<string>();
  for (const f of allFormats) {
    const key = `${f.resolution}-${f.ext}`;
    if (seen.has(key)) continue;
    const existing = formats.find((x) => `${x.resolution}-${x.ext}` === key);
    if (existing) {
      // Prefer the one that has both video and audio.
      if (f.hasVideo && f.hasAudio && !(existing.hasVideo && existing.hasAudio)) {
        Object.assign(existing, f);
      }
      continue;
    }
    seen.add(key);
    formats.push(f);
  }

  // Sort by resolution descending (audio last).
  formats.sort((a, b) => {
    const ah = parseInt(a.resolution ?? '0');
    const bh = parseInt(b.resolution ?? '0');
    return bh - ah;
  });

  const slides = extractSlides(raw);
  const isSlideshow = slides.length > 0;

  return {
    id: raw.id ?? '',
    title: raw.title ?? 'Untitled',
    thumbnail: raw.thumbnail ?? raw.thumbnails?.[0]?.url ?? '',
    duration: raw.duration ?? undefined,
    uploader: raw.uploader ?? raw.channel ?? undefined,
    uploadDate: raw.upload_date ?? undefined,
    extractor: raw.extractor_key ?? raw.extractor ?? 'generic',
    webpageUrl: raw.webpage_url ?? url,
    formats,
    slides,
    isSlideshow,
  };
}

/**
 * Resolve a direct media URL for a given format.
 * For TikTok / Instagram this returns the watermark-free CDN source.
 */
export async function getDownloadUrl(
  url: string,
  format?: string,
): Promise<DownloadLink> {
  const args = [
    '-g',
    '--no-warnings',
    '--no-check-certificates',
    '--no-playlist',
  ];

  if (format) {
    args.push('-f', format);
  } else {
    // Prefer best video+audio merged, fall back to best single file.
    args.push('-f', 'bv*+ba/b');
  }

  args.push(url);

  const output = await ytDlpWrap.execPromise(args);
  const links = output
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (links.length === 0) {
    throw new Error('Tidak ditemukan link download untuk URL tersebut.');
  }

  // If multiple URLs (video + audio), we return the first (usually merged or video).
  return {
    url: links[0],
    ext: 'mp4',
    resolution: format ?? 'best',
  };
}

/** Best merged format id string used as a default. */
export const DEFAULT_FORMAT = 'bv*+ba/b';

/**
 * Resolve the ffmpeg binary path.
 * Order: bundled ./bin/ffmpeg(.exe), then system PATH.
 */
export function resolveFfmpegPath(): string | null {
  const exe = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  const candidates = [
    path.join(process.cwd(), 'bin', exe),
    path.join('/tmp', exe),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  // Check PATH
  const pathVar = process.env.PATH || '';
  const sep = process.platform === 'win32' ? ';' : ':';
  for (const dir of pathVar.split(sep)) {
    if (!dir) continue;
    const p = path.join(dir, exe);
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      /* ignore */
    }
  }
  return null;
}

export function hasFfmpeg(): boolean {
  return resolveFfmpegPath() !== null;
}

export interface DownloadedFile {
  path: string;
  filename: string;
  contentType: string;
}

const TEMP_DIR = () =>
  process.env.VERCEL ? '/tmp' : path.join(process.cwd(), '.tmp-downloads');

/**
 * Download a video (optionally merging video+audio via ffmpeg) to a local
 * temp file and return its path so the route can stream it back.
 *
 * @param url       source URL
 * @param opts.audioOnly   extract audio only
 * @param opts.height      preferred max height for video (e.g. 1080)
 */
export async function downloadToFile(
  url: string,
  opts: { audioOnly?: boolean; height?: number } = {},
): Promise<DownloadedFile> {
  const dir = TEMP_DIR();
  fs.mkdirSync(dir, { recursive: true });

  // Unique-ish output name; yt-dlp appends the real extension.
  const base = path.join(dir, `dl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const outTemplate = `${base}.%(ext)s`;

  const args = [
    url,
    '-o',
    outTemplate,
    '--no-warnings',
    '--no-check-certificates',
    '--no-playlist',
    '--restrict-filenames',
    '--newline',
  ];

  const ffmpeg = resolveFfmpegPath();
  if (ffmpeg) {
    args.push('--ffmpeg-location', ffmpeg);
  }

  if (opts.audioOnly) {
    args.push('-x', '--audio-format', 'mp3', '-f', 'bestaudio/best');
  } else if (opts.height) {
    // Merge best video <= height with best audio, fallback to best progressive.
    args.push(
      '-f',
      `bestvideo[height<=${opts.height}]+bestaudio/best[height<=${opts.height}]/best`,
      '--merge-output-format',
      'mp4',
    );
  } else {
    args.push('-f', 'bv*+ba/b', '--merge-output-format', 'mp4');
  }

  await ytDlpWrap.execPromise(args);

  // Find the produced file(s) in the temp dir matching the base name.
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.startsWith(path.basename(base)))
    .map((f) => path.join(dir, f))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

  if (files.length === 0) {
    throw new Error('Gagal mengunduh file (tidak ada output).');
  }

  const filePath = files[0];
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const contentTypeMap: Record<string, string> = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    mkv: 'video/x-matroska',
    mp3: 'audio/mpeg',
    m4a: 'audio/mp4',
    opus: 'audio/ogg',
    ogg: 'audio/ogg',
    wav: 'audio/wav',
  };
  const contentType = contentTypeMap[ext] || 'application/octet-stream';
  const filename = opts.audioOnly
    ? `audio.${ext}`
    : `video.${ext}`;

  return { path: filePath, filename, contentType };
}
