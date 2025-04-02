import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdnlearnblog.etmoney.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
