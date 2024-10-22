export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-bg': "url('../src/assets/TradeBg.svg')",
      },
      borderColor: {
        'custom-gradient': 'linear-gradient(90deg, #3790FF, #86AFFF, #0067A1)',
      },
    },
  },
  plugins: [],
}