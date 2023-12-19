/** @type {import('next').NextConfig} */
const nextConfig = {
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
            },
            {
                protocol: 'http',
                hostname: 'app',
                port: '4040',
                pathname: '/**'
            }
        ]
    }
}

module.exports = nextConfig
