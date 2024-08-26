/** @type {import('tailwindcss').Config} */
// const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#444791',
        secondary: '#da3b01',
        success: '#21961B',
        warning: '#FCB000',
        danger: '#DB3A1A',
      },
    },
  },
  plugins: [],
};
