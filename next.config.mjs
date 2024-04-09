/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
    remotePatterns: [
      {
        hostname: 'a0.muscache.com',
        protocol: 'https',
        port: '',
      },
      {
        hostname: 'wvqjkxisymovvcqmwxhn.supabase.co', //supabase hostname for images
        protocol: 'https',
        port: '',
      },
    ],
  },
};

export default nextConfig;
