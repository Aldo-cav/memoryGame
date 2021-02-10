module.exports = {
  important: true,
  purge: {
    enabled: true,
    preserveHtmlElements: false,
    content: [
      './dist/**/*.html',
      './dist/**/*.js',
    ],
    options: {
      keyframes: true,
    }
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      mono: '"Ubuntu Mono"'
      },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer')
  ],
}
