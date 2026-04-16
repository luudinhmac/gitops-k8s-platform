import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
