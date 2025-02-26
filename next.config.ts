import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = 'source-map';
    }
    return config;
  },
  /* other config options here */
};

export default nextConfig;
