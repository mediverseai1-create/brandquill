import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1445",
        sky: { DEFAULT: "#CFE6FF", soft: "#E8F3FF" },
        coral: { DEFAULT: "#F2442F", dark: "#D43321" },
        paper: "#FBF8F3",
        line: "#D9DEEA",
        mute: "#5A6285",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
