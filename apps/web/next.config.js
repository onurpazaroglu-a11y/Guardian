/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // Required for Docker
    async rewrites() {
        return [];
    },
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
                ],
            },
        ];
    },
};

module.exports = nextConfig;