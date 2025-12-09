module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        'brutal-yellow': '#facc15',
        'brutal-cyan': '#22d3ee',
        'brutal-pink': '#f472b6',
        'brutal-lime': '#a3e635',
        'brutal-white': '#ffffff',
        'brutal-black': '#000000',
        'brutal-blue': '#3b82f6',
        'brutal-purple': '#8b5cf6',
        'brutal-green': '#22c55e',
        'brutal-gray': '#6b7280',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'brutal': '0.5rem',
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-lg': '8px 8px 0px 0px #000000',
        'brutal-sm': '2px 2px 0px 0px #000000',
      },
      fontFamily: {
        brutal: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: []
}
