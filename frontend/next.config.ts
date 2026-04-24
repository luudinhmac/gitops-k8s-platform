import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        unoptimized: true, // Allow local images from localhost/private IPs
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3001',
                pathname: '/**',
            },
        ],
    },
    turbopack: {
        root: '..',
    },
    async rewrites() {
        const internalApiUrl = process.env.INTERNAL_API_URL || 'http://localhost:3001/api';
        // Remove trailing slash and /api suffix to use as base destination
        const destinationBase = internalApiUrl.replace(/\/api\/?$/, '');
        
        return [
            {
                source: '/api/:path*',
                destination: `${destinationBase}/api/:path*`,
            },
            {
                source: '/uploads/:path*',
                destination: `${destinationBase}/uploads/:path*`,
            },
        ];
    },
};

export default nextConfig;
