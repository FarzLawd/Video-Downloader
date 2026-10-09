export interface PlatformConfig {
  id: string;
  slug: string;
  name: string;
  placeholder: string;
  description: string;
  /** Accent hex color used for the card icon + highlight. */
  color: string;
  /** Soft tint background hex for the card icon. */
  soft: string;
  /** Whether this platform supports photo slideshow / carousel (menu Foto/Video). */
  supportsSlideshow: boolean;
}

export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'tiktok',
    slug: 'tiktok-downloader',
    name: 'TikTok',
    placeholder: 'Tempel link TikTok di sini…',
    description: 'Video tanpa watermark & slide foto.',
    color: '#F687B3',
    soft: '#FED7E2',
    supportsSlideshow: true,
  },
  {
    id: 'youtube',
    slug: 'youtube-downloader',
    name: 'YouTube',
    placeholder: 'Tempel link YouTube di sini…',
    description: 'Pilih resolusi lalu download (MP4 & MP3).',
    color: '#F56565',
    soft: '#FED7D7',
    supportsSlideshow: false,
  },
  {
    id: 'instagram',
    slug: 'instagram-downloader',
    name: 'Instagram',
    placeholder: 'Tempel link Instagram di sini…',
    description: 'Download Reels, IGTV, foto & carousel.',
    color: '#9F7AEA',
    soft: '#EBE4FF',
    supportsSlideshow: true,
  },
  {
    id: 'twitter',
    slug: 'twitter-downloader',
    name: 'Twitter / X',
    placeholder: 'Tempel link Twitter/X di sini…',
    description: 'Download video & GIF dari tweet.',
    color: '#4299E1',
    soft: '#BEE3F8',
    supportsSlideshow: false,
  },
  {
    id: 'facebook',
    slug: 'facebook-downloader',
    name: 'Facebook',
    placeholder: 'Tempel link Facebook di sini…',
    description: 'Download video dari Facebook & Reels.',
    color: '#3182CE',
    soft: '#DBEAFE',
    supportsSlideshow: false,
  },
  {
    id: 'reddit',
    slug: 'reddit-downloader',
    name: 'Reddit',
    placeholder: 'Tempel link Reddit di sini…',
    description: 'Download video dari Reddit.',
    color: '#ED8936',
    soft: '#FEEBC8',
    supportsSlideshow: false,
  },
];

export function getPlatform(slug: string): PlatformConfig | undefined {
  return PLATFORMS.find((p) => p.slug === slug);
}
