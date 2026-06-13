/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: '#F7F3EC',
        sand: '#E8D5B0',
        'forest-green': '#2D5A1B',
        'leaf-green': '#5A8A2E',
        'sage-green': '#A8C97F',
        'deep-brown': '#2C1A0E',
        'earth-brown': '#8B5E3C',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
