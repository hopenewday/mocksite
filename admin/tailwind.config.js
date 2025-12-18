
const { vuestic } = require('@vuestic/tailwind')

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [vuestic()],
}
