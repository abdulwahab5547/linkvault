import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#1E1E1E',
        lessDark: '#262626',
        orange: '#FF6600',
        light: '#FFFFFF',
        lessLight: '#F5F5F5',
        linkcard: '#262626',
        cardborder: '#3D3D3D',
        lightcardborder: '#E0E0E0',
      },
    },
  },
  plugins: [],
};
export default config;