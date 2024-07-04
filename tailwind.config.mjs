/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/html/utils/withMT";

const fontFamily = {
  sans: ["Roboto", "sans-serif"],
  serif: ["Roboto Slab", "serif"],
  body: ["Roboto", "sans-serif"],
  mono: [
    "SFMono-Regular",
    "Menlo",
    "Monaco",
    "Consolas",
    "Liberation Mono",
    "Courier New",
    "monospace",
  ],
};

const screens = {
  sm: "540px",
  md: "720px",
  lg: "960px",
  "lg-max": { max: "960px" },
  xl: "1140px",
  "2xl": "1320px",
};

export default withMT({
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/@material-tailwind/html/**",
  ],
  theme: {
    fontFamily: {
      fontFamily,
    },
    screens: {
      screens,
    },
    extend: {},
  },
  plugins: [],
});
