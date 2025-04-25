/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["fakestoreapi.com", "via.placeholder.com", "images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  experimental: {
    optimizeCss: true
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      type: "asset/resource"
    });
    return config;
  }
};

module.exports = nextConfig;
