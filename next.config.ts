/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "ui-avatars.com" }],
    // atau kalau kamu masih pakai format lama:
    // domains: ["ui-avatars.com"],
  },
};
module.exports = nextConfig;
