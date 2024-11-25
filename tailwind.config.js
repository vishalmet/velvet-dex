export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-bg": "url('../src/assets/TradeBg.svg')",
      },
      borderColor: {
        "custom-gradient": "linear-gradient(90deg, #3790FF, #86AFFF, #0067A1)",
      },
      animation: {
        "spinner-ease-spin": "ease-spin 1.5s infinite linear",
        "spinner-linear-spin": "linear-spin 1s infinite linear",
      },
      keyframes: {
        "ease-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "linear-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      borderWidth: {
        3: "3px",
      },
      screens: {
        sm: "450px", // Custom small screen starting from 450px
      },
    },
  },
  plugins: [],
};