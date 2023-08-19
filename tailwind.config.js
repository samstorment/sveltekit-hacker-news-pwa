import plugin from "tailwindcss/plugin";
import defaultTheme from "tailwindcss/defaultTheme";


/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    screens: {
      '2xs': '340px',
      'xs': '475px',
      ...defaultTheme.screens
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(({ addVariant }) => {
      addVariant('lefty', ':is(.lefty &)')
    })
  ],
  darkMode: 'class'
}