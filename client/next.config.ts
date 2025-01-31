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
};

export default nextConfig;
