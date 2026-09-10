import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // MDX lives as filesystem content; no special bundler plugin required
  // because we compile via next-mdx-remote/rsc at request/build time.
};

export default nextConfig;
