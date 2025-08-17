/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Silence dev warning when using 127.0.0.1
  allowedDevOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
};
export default nextConfig;