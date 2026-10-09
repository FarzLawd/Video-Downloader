# 🎬 GrabVid — Watermark-Free Video Downloader

A modern, multi-platform video downloader. Paste a link, pick a resolution, and download — **no watermark**, free and fast.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS**, powered by **yt-dlp** and **ffmpeg**.

> ⚠️ **Disclaimer:** Use this tool only for content you own or have permission to download. Respect the Terms of Service and copyright of each platform.

---

## ✨ Features

- 🎯 Multi-platform support (TikTok, YouTube, Instagram, Twitter/X, Facebook, Reddit)
- 🚫 **Watermark-free** downloads (fetches the original CDN source)
- 🎚️ Multiple resolutions (1080p, 720p, 480p, …) with **video + audio merge** via ffmpeg
- 🎵 Audio / MP3 extraction
- 📷 TikTok photo-slide (carousel) support with a Photo/Video toggle
- 🎨 Playful, responsive UI with original brand icons

---

## 🗂️ Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — pick a platform |
| `/tiktok-downloader` | TikTok: paste link → if it's a **photo slide**, a **Photo / Video** toggle appears; otherwise pick quality and download |
| `/youtube-downloader` | YouTube: paste link → pick resolution (MP4) or extract MP3 → download (y2mate-style) |
| `/instagram-downloader` | Instagram Reels, IGTV, photos & carousels |
| `/twitter-downloader` | Twitter/X videos & GIFs |
| `/facebook-downloader` | Facebook videos & Reels |
| `/reddit-downloader` | Reddit videos |

---

## 🚀 Getting Started (Local)

### 1. Prerequisites

- **Node.js 18+**
- **yt-dlp** binary in `bin/` (or available on PATH)
- **ffmpeg** binary in `bin/` (or on PATH) — required for high-resolution video+audio merge

### 2. Download the binaries (Windows, no Python needed)

```powershell
# yt-dlp
New-Item -ItemType Directory -Force -Path bin | Out-Null
Invoke-WebRequest -Uri "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe" -OutFile "bin\yt-dlp.exe"

# ffmpeg + ffprobe
$zip = "bin\ffmpeg.zip"
Invoke-WebRequest -Uri "https://github.com/BtbN/FFmpeg-Builds/releases/latest/download/ffmpeg-master-latest-win64-gpl.zip" -OutFile $zip
Expand-Archive -Path $zip -DestinationPath "bin\ffmpeg-extract" -Force
Copy-Item "bin\ffmpeg-extract\*\bin\ffmpeg.exe" "bin\ffmpeg.exe" -Force
Copy-Item "bin\ffmpeg-extract\*\bin\ffprobe.exe" "bin\ffprobe.exe" -Force
Remove-Item -Recurse -Force "bin\ffmpeg-extract"; Remove-Item -Force $zip
```

> The app auto-detects binaries at `bin/yt-dlp(.exe)` and `bin/ffmpeg(.exe)`, then falls back to PATH.

**Alternative:** `pip install yt-dlp` and `winget install ffmpeg`.

### 3. Install & run

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## 🎬 Video + Audio Merge

For high-resolution YouTube videos, the video and audio streams are separate (DASH).
The backend merges them into a single `.mp4` using **ffmpeg**, so downloads include sound.

- With ffmpeg → full `.mp4` with audio.
- Without ffmpeg → progressive formats (video+audio combined, usually ≤360p) still work; higher resolutions download as video-only.

---

## 📡 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/info?url=<URL>` | Fetch metadata + available formats (includes `ffmpegAvailable`) |
| `GET /api/download?url=<URL>&height=<H>` | Stream merged video up to height `H` (e.g. `720`) |
| `GET /api/download?url=<URL>&audio=1` | Stream extracted audio as MP3 |

Examples:

```bash
# Get video info
curl "http://localhost:3000/api/info?url=https://www.youtube.com/watch?v=jNQXAC9IVRw"

# Download 720p video (merged with audio)
curl -o video.mp4 "http://localhost:3000/api/download?url=https://www.youtube.com/watch?v=jNQXAC9IVRw&height=720"

# Extract audio as MP3
curl -o audio.mp3 "http://localhost:3000/api/download?url=https://www.youtube.com/watch?v=jNQXAC9IVRw&audio=1"
```

---

## 🧰 Project Structure

```
video-downloader/
├── app/
│   ├── api/
│   │   ├── info/route.ts             # metadata endpoint (+ slide detection)
│   │   └── download/route.ts         # streaming download endpoint
│   ├── tiktok-downloader/page.tsx
│   ├── youtube-downloader/page.tsx
│   ├── instagram-downloader/page.tsx
│   ├── twitter-downloader/page.tsx
│   ├── facebook-downloader/page.tsx
│   ├── reddit-downloader/page.tsx
│   ├── globals.css                   # design tokens
│   ├── layout.tsx                    # fonts + navbar/footer shell
│   └── page.tsx                      # landing page
├── components/
│   ├── downloader-client.tsx         # shared downloader UI
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── PlatformIcon.tsx          # brand SVG icons
├── lib/
│   ├── downloader.ts                 # yt-dlp / ffmpeg wrapper
│   └── platforms.ts                  # platform registry
├── bin/                              # binaries (git-ignored, download locally)
├── package.json
├── tailwind.config.ts
└── vercel.json
```

---

## ☁️ Deploying to Vercel

> **Note:** Vercel's serverless runtime does not include ffmpeg by default and has execution time limits. Full-resolution merging works best **locally**. For Vercel, consider self-hosting or adding a static ffmpeg layer + longer durations (Pro plan).

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Framework preset: **Next.js** (auto-detected).
4. Click **Deploy**.

Or via CLI:

```bash
npm i -g vercel
vercel
```

For Vercel, bundle a Linux `yt-dlp` binary at `bin/yt-dlp`:

```bash
mkdir -p bin
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o bin/yt-dlp
chmod +x bin/yt-dlp
```

---

## ⚠️ Known Limitations

- **Vercel (Hobby)** has function duration limits; very long/heavy videos may time out — upgrade or self-host.
- Some platforms (e.g. YouTube) restrict downloads via their ToS. Use responsibly.
- `bin/*` binaries are **git-ignored**; re-download them in each environment (see steps above).
- If a platform changes, update `yt-dlp` to the latest version.
