import DownloaderClient from '@/components/downloader-client';
import { getPlatform } from '@/lib/platforms';

export const metadata = {
  title: 'Reddit Downloader — Video | GrabVid',
  description: 'Download video dari Reddit secara gratis.',
};

export default function RedditDownloaderPage() {
  const platform = getPlatform('reddit-downloader')!;
  return <DownloaderClient platform={platform} />;
}
