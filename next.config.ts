import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                hostname: 'media.kitsu.app',
                protocol: 'https',
            },
        ],
    },
};

export default nextConfig;
