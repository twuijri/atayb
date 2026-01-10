/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config, { dev, isServer }) => {
    return config;
  },
};

export default nextConfig;
