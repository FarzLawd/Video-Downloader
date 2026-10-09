import DownloaderClient from '@/components/downloader-client';
import { getPlatform } from '@/lib/platforms';

export const metadata = {
  title: 'TikTok Downloader — Tanpa Watermark | GrabVid',
  description:
    'Download video TikTok tanpa watermark, atau simpan slide foto TikTok secara gratis.',
};

export default function TikTokDownloaderPage() {
  const platform = getPlatform('tiktok-downloader')!;
  return <DownloaderClient platform={platform} />;
}
