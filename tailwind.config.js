/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#f5f5f5',
          card: '#ffffff',
          control: '#e5e5e5',
        },
        dark: {
          bg: '#121212',
          card: '#1a1a1a',
          control: '#2a2a2a',
        },
      },
    },
  },
  plugins: [],
}
