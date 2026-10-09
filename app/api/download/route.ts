import { NextRequest, NextResponse } from 'next/server';
import { downloadToFile, isValidUrl } from '@/lib/downloader';
import fs from 'fs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')?.trim();
  const audioOnly = request.nextUrl.searchParams.get('audio') === '1';
  const heightStr = request.nextUrl.searchParams.get('height')?.trim();
  const height = heightStr ? parseInt(heightStr, 10) : undefined;

  if (!url) {
    return NextResponse.json(
      { error: 'Parameter "url" wajib diisi.' },
      { status: 400 },
    );
  }

  if (!isValidUrl(url)) {
    return NextResponse.json(
      { error: 'URL tidak valid.' },
      { status: 400 },
    );
  }

  try {
    const file = await downloadToFile(url, {
      audioOnly,
      height: height && !Number.isNaN(height) ? height : undefined,
    });

    const stat = fs.statSync(file.path);
    const stream = fs.createReadStream(file.path);

    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        'Content-Type': file.contentType,
        'Content-Length': String(stat.size),
        'Content-Disposition': `attachment; filename="${file.filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    const message =
      err?.message ?? 'Gagal mengunduh video. Coba lagi nanti.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
