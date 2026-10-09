import type { Metadata } from 'next';
import { Comfortaa, IBM_Plex_Mono } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

const comfortaa = Comfortaa({
  subsets: ['latin'],
  variable: '--font-comfortaa',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-mono',
  display: 'swap',
});
 
export const metadata: Metadata = {
  title: 'GrabVid — Download Video Tanpa Watermark',
  description:
    'Download video dari TikTok, YouTube, Instagram, Twitter/X, Facebook, dan lainnya tanpa watermark, gratis & cepat.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${comfortaa.variable} ${plexMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
