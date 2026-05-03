import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      { source: "/u/script.js", destination: "https://cloud.umami.is/script.js" },
      { source: "/u/api/send", destination: "https://api-gateway.umami.dev/api/send" },
    ];
  },
};

export default nextConfig;
