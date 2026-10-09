import DownloaderClient from '@/components/downloader-client';
import { getPlatform } from '@/lib/platforms';

export const metadata = {
  title: 'YouTube Downloader — MP4 & MP3 | GrabVid',
  description:
    'Download video YouTube dalam berbagai resolusi (MP4) atau ekstrak audio (MP3), gratis.',
};

export default function YouTubeDownloaderPage() {
  const platform = getPlatform('youtube-downloader')!;
  return <DownloaderClient platform={platform} />;
}
