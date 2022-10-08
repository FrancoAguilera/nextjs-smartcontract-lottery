/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  future: {
    webpack5: false,
  },
  webpack: function (config, options) {
    config.experiments = {}
    return config
  },
}

module.exports = nextConfig
