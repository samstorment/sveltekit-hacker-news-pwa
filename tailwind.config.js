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
      // hocus variants found here https://soorria.com/snippets/tailwindcss-hocus
      addVariant('hocus', ['&:hover', '&:focus'])
      addVariant('hocus-within', ['&:hover', '&:focus-within'])
      addVariant('group-hocus', [
        ':merge(.group):hover &',
        ':merge(.group):focus &',
      ])
      addVariant('group-hocus-within', [
        ':merge(.group):hover &',
        ':merge(.group):focus-within &',
      ])
    }),
    
  ],
  darkMode: 'class'
}