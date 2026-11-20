import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Builds to a fully static site in `out/` (deployable to Vercel, Netlify or GitHub Pages)
  output: "export",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
