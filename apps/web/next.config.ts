import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@funeral/api-client",
    "@funeral/demo-data",
    "@funeral/shared-logic",
    "@funeral/shared-types",
    "@funeral/validation",
  ],
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
