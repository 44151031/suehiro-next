import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography"; // ←追加

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [typography], // ←追加
};

export default config;
