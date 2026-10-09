/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow larger API response bodies for metadata JSON.
  experimental: {
    serverComponentsExternalPackages: ['yt-dlp-wrap'],
  },
};

export default nextConfig;
