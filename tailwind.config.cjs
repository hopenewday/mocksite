module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#5b5fc7', // Slate Indigo
          dark: '#4c4fb0',
          violet: '#6D28D9', // Deep Violet
          green: '#22c55e', // Emerald Green
          blue: '#3B82F6', // Sky Blue
          orange: '#F59E0B', // Sunset Orange
          red: '#F43F5E' // Rose Red
        },
        brutal: {
          yellow: '#facc15',
          cyan: '#22d3ee',
          pink: '#f472b6',
          lime: '#a3e635',
          white: '#ffffff',
          black: '#000000',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          green: '#22c55e',
        }
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
