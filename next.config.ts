import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // A stray lockfile in the home dir confuses Next's workspace-root inference;
  // pin tracing to this project so it doesn't pick the wrong root.
  outputFileTracingRoot: path.join(__dirname),
  // better-sqlite3 is a native module; keep it out of the server bundle so it
  // loads directly from node_modules at runtime.
  serverExternalPackages: ["better-sqlite3"],
  images: {
    // Local admin uploads (/uploads/*) need no config. Demo/seed photos may
    // reference Unsplash; whitelist its CDN so next/image can optimize them.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
