import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // This tells Next.js to allow images from these external domains
    remotePatterns: [
      {
        protocol: "https", // Google image URLs are typically HTTPS
        hostname: "lh3.googleusercontent.com", // The required host for Google profile pictures
        port: "",
        pathname: "/**", // Allows any path on this hostname
      },
      // You may also want to add pravatar.cc if you use the seeded users:
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
    ],
  },
  devIndicators: false,
};

export default nextConfig;
