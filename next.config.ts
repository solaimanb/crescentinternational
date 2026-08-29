import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.storage.c-5.us-east-2.aws.neon.tech",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin/index.html",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/admin/settings/:id",
        destination: "/admin/settings",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
