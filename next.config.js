/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Add SVGR support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;
