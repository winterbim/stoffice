import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  logging: {
    fetches: { fullUrl: true },
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
