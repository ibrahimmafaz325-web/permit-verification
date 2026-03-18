import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Keeps the PWA inactive while coding
});

const nextConfig: NextConfig = {
  // This explicitly tells Next.js we are aware of Turbopack and to silence the Webpack conflict error
  turbopack: {}, 
};

export default withPWA(nextConfig);