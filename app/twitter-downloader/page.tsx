import DownloaderClient from '@/components/downloader-client';
import { getPlatform } from '@/lib/platforms';

export const metadata = {
  title: 'Twitter / X Downloader — Video & GIF | GrabVid',
  description:
    'Download video dan GIF dari tweet Twitter/X secara gratis.',
};

export default function TwitterDownloaderPage() {
  const platform = getPlatform('twitter-downloader')!;
  return <DownloaderClient platform={platform} />;
}
