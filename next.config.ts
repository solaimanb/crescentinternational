import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
  images: {
    // `qualities` is required in Next.js 16 to restrict which quality values
    // the Image Optimization API accepts. Unrestricted access was removed to
    // prevent abuse of the optimization endpoint.
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.storage.c-5.us-east-2.aws.neon.tech",
        // `search: ""` explicitly blocks query strings on Neon storage URLs,
        // preventing unintended cache-busting or parameter injection.
        search: "",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        search: "",
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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
