/** @type {import('tailwindcss').Config} */
const shadcnConfig = require("shadcn/ui/tailwind.config")

module.exports = {
  ...shadcnConfig,
  content: ["./src/**/*.{html,js,svelte,ts}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    ...shadcnConfig.theme,
    extend: {
      ...shadcnConfig.theme.extend,
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "var(--text-color)",
            a: {
              color: "var(--primary-color)",
              "&:hover": {
                color: "var(--secondary-color)",
              },
            },
            h1: {
              color: "var(--text-color)",
            },
            h2: {
              color: "var(--text-color)",
            },
            h3: {
              color: "var(--text-color)",
            },
            h4: {
              color: "var(--text-color)",
            },
            h5: {
              color: "var(--text-color)",
            },
            h6: {
              color: "var(--text-color)",
            },
          },
        },
      },
    },
  },
  plugins: [
    ...shadcnConfig.plugins,
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
}
