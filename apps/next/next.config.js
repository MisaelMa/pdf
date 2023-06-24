/** @type {import('next').NextConfig} */
const path = require('path');/*eslint-env es6*/
const {
  NODE_ENV
} = process.env;
const isProdMode = NODE_ENV === 'production';

const nextConfig = {
  distDir: '.next',
  swcMinify: true,
  reactStrictMode: true,
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: {
      displayName: true,
      ssr: true,
      minify: true,
    },
  },
  experimental: {
    externalDir: true,
    appDir: true,
    // outputFileTracingRoot: path.join(__dirname, '../..'),
  },
  eslint: {
    ignoreDuringBuilds: isProdMode,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  "plugins": [
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env",
      {
        "autoprefixer": {
          "flexbox": "no-2009"
        },
        "stage": 3,
        "features": {
          "custom-properties": false
        }
      }
    ]
  ],
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    config.resolve.alias.canvas = false
    return config;
  },

}

module.exports = nextConfig
