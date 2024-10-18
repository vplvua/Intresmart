/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        gray: {
          100: "#020002",
          80: "#0A0A0A",
          70: "#0D0D0D",
          75: "#495057",
          60: "#868E96",
          50: "#ADB5BD",
          40: "#CED4DA",
          10: "#DEE2E6",
          5: "#F1F3F5",
          0: "#F8F9FA",
        },
        primary: {
          100: "#018F51",
        },
      },
      fontFamily: {
        sans: ["Helvetica", "sans-serif"],
      },
      fontSize: {
        sm: [
          "14px",
          {
            lineHeight: "135%",
            letterSpacing: "0",
            fontWeight: "400",
            fontStyle: "normal",
          },
        ],
        base: [
          "16px",
          {
            lineHeight: "135%",
            letterSpacing: "0",
            fontWeight: "400",
            fontStyle: "normal",
          },
        ],
        main: [
          "18px",
          {
            lineHeight: "135%",
            letterSpacing: "0",
            fontWeight: "400",
            fontStyle: "normal",
          },
        ],
        h6: [
          "24px",
          {
            lineHeight: "135%",
            letterSpacing: "0",
            fontWeight: "400",
            fontStyle: "normal",
          },
        ],
        h5: [
          "40px",
          {
            lineHeight: "120%",
            letterSpacing: "0",
            fontWeight: "400",
            fontStyle: "normal",
          },
        ],
        h4: [
          "48px",
          {
            lineHeight: "120%",
            letterSpacing: "0",
            fontWeight: "400",
            fontStyle: "normal",
          },
        ],
        h3: [
          "67px",
          {
            lineHeight: "120%",
            letterSpacing: "0",
            fontWeight: "400",
            fontStyle: "normal",
          },
        ],
        h2: [
          "104px",
          {
            lineHeight: "115%",
            letterSpacing: "0",
            fontWeight: "400",
            fontStyle: "normal",
          },
        ],
        h1: [
          "156px",
          {
            lineHeight: "105%",
            letterSpacing: "9px",
            fontWeight: "700",
            fontStyle: "normal",
          },
        ],
      },
      fontWeight: {
        normal: 400,
        bold: 700,
      },
      backgroundImage: {
        "gradient-custom":
          "linear-gradient(95deg, rgba(217, 217, 217, 0.10) 19.1%, rgba(217, 217, 217, 0.00) 93.23%)",
        "gradient-hover":
          "linear-gradient(180deg, rgba(103, 241, 133, 0.80) 0%, rgba(132, 224, 237, 0.55) 80.5%)",
        "gradient-focus":
          "linear-gradient(180deg, rgba(79, 255, 117, 0.80) 0%, rgba(132, 224, 237, 0.55) 80.5%)",
      },
    },
  },
  plugins: [],
  safelist: [],
};