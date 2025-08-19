import withBundleAnalyzer from '@next/bundle-analyzer';

// Bundle analyzer configuration
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Speed up local pre-push builds when FAST_PREPUSH=1
  eslint: {
    ignoreDuringBuilds: process.env.FAST_PREPUSH === '1',
  },
  typescript: {
    ignoreBuildErrors: process.env.FAST_PREPUSH === '1',
  },
  // Vercel-optimized configuration
  experimental: {
    // Optimize for Vercel's infrastructure
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'framer-motion',
      'gsap',
      'lucide-react',
      '@radix-ui/react-select',
      '@radix-ui/react-slider',
      '@radix-ui/react-tooltip',
    ],
    // Enable dynamic imports optimization
    esmExternals: true,
    // Turbo optimizations
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Performance optimizations for Vercel
  compress: true,
  poweredByHeader: false,

  // Advanced code splitting for optimal performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },

  // Modern output configuration
  output: 'standalone',

  // Enable source maps for better debugging on Vercel
  productionBrowserSourceMaps: true,

  // Vercel-optimized image configuration
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Vercel automatically optimizes images
    loader: 'default',
  },

  // Vercel-specific optimizations
  outputFileTracing: true,
  swcMinify: true,
  webpack: (config, { dev, isServer }) => {
    // Ensure we're using standard Webpack, not Turbopack
    config.name = isServer ? 'server' : 'client';

    // Ignore test files to prevent them from being treated as pages
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    // Bundle optimization for production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 20,
            maxSize: 200000, // Split large vendor chunks
          },
          common: {
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 30,
          },
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
            priority: 25,
          },
          gsap: {
            test: /[\\/]node_modules[\\/]gsap[\\/]/,
            name: 'gsap',
            chunks: 'all',
            priority: 25,
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
            name: 'ui-components',
            chunks: 'all',
            priority: 25,
          },
        },
      };
    }

    return config;
  },

  // Note: Custom headers and redirects are handled in netlify.toml for static export
};

// Apply bundle analyzer and Sentry config
const finalConfig = bundleAnalyzer(nextConfig);

// Export final configuration
export default finalConfig;
