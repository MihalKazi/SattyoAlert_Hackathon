/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for AI libraries using WASM
  serverExternalPackages: ['@xenova/transformers'],
  
  // Clean up the experimental block
  experimental: {},
  
  reactStrictMode: true,
};

export default nextConfig;