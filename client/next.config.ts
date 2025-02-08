import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals = [...config.externals, {canvas: "canvas"}];
    return config;
  },
  experimental: {
    esmExternals: "loose",
    reactCompiler: true,
  },
  api: {
    responseLimit: false,
  },
};

export default nextConfig;
