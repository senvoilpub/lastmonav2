/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Disable image optimization to avoid issues with subdomains
    // Images will still work, just without Next.js optimization
    unoptimized: process.env.NODE_ENV === 'production' ? false : false,
    // Allow all image formats
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

