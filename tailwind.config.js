/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'custom': '520px',
      },
      boxShadow: {
        'bottom': '0px 3px 14px 0px rgba(0, 0, 0, 0.1)',
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        caveat: ['Caveat', 'cursive'], // Add the Caveat font here
      },
    },
  },
  plugins: [],
}
