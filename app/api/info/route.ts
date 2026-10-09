import { NextRequest, NextResponse } from 'next/server';
import { getVideoInfo, hasFfmpeg, isValidUrl } from '@/lib/downloader';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')?.trim();

  if (!url) {
    return NextResponse.json(
      { error: 'Parameter "url" wajib diisi.' },
      { status: 400 },
    );
  }

  if (!isValidUrl(url)) {
    return NextResponse.json(
      { error: 'URL tidak valid. Pastikan diawali dengan http:// atau https://' },
      { status: 400 },
    );
  }

  try {
    const info = await getVideoInfo(url);
    return NextResponse.json({ ...info, ffmpegAvailable: hasFfmpeg() });
  } catch (err: any) {
    const message =
      err?.message ?? 'Gagal mengambil informasi video. Coba lagi nanti.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
