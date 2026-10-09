import DownloaderClient from '@/components/downloader-client';
import { getPlatform } from '@/lib/platforms';

export const metadata = {
  title: 'Instagram Downloader — Reels, Foto & Carousel | GrabVid',
  description:
    'Download video Instagram (Reels, IGTV), foto, dan carousel secara gratis.',
};

export default function InstagramDownloaderPage() {
  const platform = getPlatform('instagram-downloader')!;
  return <DownloaderClient platform={platform} />;
}
