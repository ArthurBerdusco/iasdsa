/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          'sans': ['Roboto', 'system-ui', 'sans-serif'],
          'montserrat': ['Montserrat', 'system-ui', 'sans-serif'],
          'nunito': ['Nunito', 'system-ui', 'sans-serif'],
        },
        colors: {
          'brand-blue': {
            light: 'var(--brand-blue-light)',
            medium: 'var(--brand-blue-medium)',
            deep: 'var(--brand-blue-deep)',
          },
          'brand-yellow': {
            light: 'var(--brand-yellow-light)',
          },
        },
      },
    },
    plugins: [],
  }