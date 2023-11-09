/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: { serverActions: true },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '4040',
                pathname: '/**'
            }
        ]
    }
}

module.exports = nextConfig
