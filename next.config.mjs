/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'panels-cdn.imgix.net',
      },
    ],
  },
};

export default nextConfig;
