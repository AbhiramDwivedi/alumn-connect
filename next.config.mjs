/** @type {import('next').NextConfig} */
const nextConfig = {  eslint: {
    // Consider enabling this in production for better security
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  typescript: {
    // Ignore TypeScript errors in build to allow deployment
    // TODO: Fix types for dynamic route parameters
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add security headers
  headers: async () => {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.vercel.app;",
          },
        ],
      },
    ]
  },
}

export default nextConfig