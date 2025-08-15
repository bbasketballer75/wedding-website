// Babel config only used for Jest testing
// Next.js will use SWC for faster builds by default when no babel config is present
module.exports = {
  // Only apply during testing
  env: {
    test: {
      presets: [
        '@babel/preset-env',
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
    },
  },
};
