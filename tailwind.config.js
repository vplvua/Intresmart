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
          75: "#495057",
          70: "#0D0D0D",
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
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 2s ease-out forwards",
      },
      borderRadius: {
        "button-sm": "100%",
      },
      borderWidth: {
        "button-sm": "0.75px",
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".case-card": {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          height: "100%",
        },
        ".case-card-svg-container": {
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#018F51",
        },
        ".hover-block": {
          display: "flex",
          width: "100%",
          padding: "24px",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "0 0 30px 30px",
          backgroundColor: "rgba(10, 10, 10, 0.5)",
          backdropFilter: "blur(13px)",
          position: "absolute",
          bottom: 0,
          left: 0,
          transform: "translateY(100%)",
          transition: "transform 0.3s ease-in-out",
        },
        ".case-card:hover .hover-block": {
          transform: "translateY(0)",
        },
      });
    },
  ],
  safelist: [],
};
