// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // correct plugin for Tailwind
    autoprefixer: {}             // vendor prefixing
    // Optional extras if you use them:
    // 'postcss-nested': {},     // for nested CSS
    // 'postcss-modules': {}     // for @reference / CSS Modules
  },
};
