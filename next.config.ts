import type { NextConfig } from "next";

const allowedDevOrigins = ['172.27.193.13', '192.168.31.88', '10.16.188.185']

const nextConfig: NextConfig = {
  allowedDevOrigins,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    proxyClientMaxBodySize: 25 * 1024 * 1024,
  },
};

export default nextConfig;
