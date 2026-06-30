import type { NextConfig } from "next";

const basePath = process.env.WIKI_BASE_PATH?.trim() || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true
  },
  allowedDevOrigins: ["127.0.0.1"]
};

export default nextConfig;
