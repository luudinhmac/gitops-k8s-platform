/** @type {import('next').NextConfig} */
// CI/CD Test Trigger: 2026-05-09-19-42
const nextConfig = {
    output: 'standalone',
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'portfolio-backend-staging',
                port: '3001',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3002',
                pathname: '/**',
            },
        ],
    },
    async rewrites() {
        const internalApiUrl = process.env.INTERNAL_API_URL;
        if (!internalApiUrl) {
            console.warn("!!! WARNING: INTERNAL_API_URL is not defined. Rewrites might not work correctly. !!!");
            return [];
        }
        // Remove trailing slash, /api/v1, AND /api to get the true root
        const backendBaseUrl = internalApiUrl
            .replace(/\/api\/v1\/?$/, '')
            .replace(/\/api\/?$/, '')
            .replace(/\/$/, '');
        
        console.log(`!!! CONFIG_ACTIVE: Targeting Backend at ${backendBaseUrl} !!!`);
        
        return [
            {
                source: '/api/:path*',
                destination: `${backendBaseUrl}/api/:path*`,
            },
            {
                source: '/uploads/:path*',
                destination: `${backendBaseUrl}/uploads/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;
