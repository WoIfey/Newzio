/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs.io'
            },
            {
                protocol: 'https',
                hostname: 'wolfey.s-ul.eu'
            },
        ],
        minimumCacheTTL: 31536000,
    },
};

export default nextConfig;
