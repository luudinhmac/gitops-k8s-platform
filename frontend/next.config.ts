import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        unoptimized: true, // Allow local images from localhost/private IPs
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3002',
                pathname: '/**',
            },
        ],
    },
    /*
    turbopack: {
        root: '.',
    },
    */
    async rewrites() {
        const internalApiUrl = process.env.INTERNAL_API_URL || 'http://127.0.0.1:3002/api';
        // Use the origin from INTERNAL_API_URL to avoid double-prefixing
        const destinationBase = new URL(internalApiUrl).origin;
        
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
