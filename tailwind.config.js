/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['node_modules/preline/dist/*.js', './frontend/**/*.{html,js}'],
  plugins: [require('preline/plugin')],
};
