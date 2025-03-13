/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        swipeRight: {
          "0%": { transform: "translateX(0) rotate(0)" },
          "100%": { transform: "translateX(200%) rotate(45deg)" },
        },
        swipeLeft: {
          "0%": { transform: "translateX(0) rotate(0)" },
          "100%": { transform: "translateX(-200%) rotate(-45deg)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite linear",
        fadeIn: "fadeIn 0.3s ease-out",
        swipeRight: "swipeRight 0.5s ease-out",
        swipeLeft: "swipeLeft 0.5s ease-out",
      },
      boxShadow: {
        glow: "0 0 15px rgba(255,255,255,0.2)",
        hover: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark"],
  },
};
