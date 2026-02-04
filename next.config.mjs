/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // สั่งให้ Next.js ไม่ต้องสน Error ตอน Build (ของจริง)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;