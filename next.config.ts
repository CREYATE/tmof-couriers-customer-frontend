import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. You may want to add linting to your CI pipeline.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors. You may want to add type-checking to your CI pipeline.
    // !! DANGER !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
