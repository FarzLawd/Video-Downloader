import DownloaderClient from '@/components/downloader-client';
import { getPlatform } from '@/lib/platforms';

export const metadata = {
  title: 'Facebook Downloader — Video & Reels | GrabVid',
  description:
    'Download video Facebook dan Facebook Reels secara gratis.',
};

export default function FacebookDownloaderPage() {
  const platform = getPlatform('facebook-downloader')!;
  return <DownloaderClient platform={platform} />;
}
