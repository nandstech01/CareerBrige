/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  cache: false, // Temporarily disable persistent cache to resolve ENOENT error
}

module.exports = nextConfig