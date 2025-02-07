import type {NextConfig} from "next";
import {setupDevPlatform} from "@cloudflare/next-on-pages/next-dev";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals = [...config.externals, {canvas: "canvas"}];
    return config;
  },
  experimental: {
    esmExternals: "loose",
    reactCompiler: true,
  },
};

export default nextConfig;
setupDevPlatform();
