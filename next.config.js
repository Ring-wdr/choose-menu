/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: "/admin/menu", destination: "/admin/menu/1" }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.coffeebeankorea.com" },
    ],
  },
};

module.exports = nextConfig;
