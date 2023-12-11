/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.coffeebeankorea.com" },
    ],
  },
};

module.exports = nextConfig;
