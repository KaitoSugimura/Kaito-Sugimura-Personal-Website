import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/Kaito-Sugimura-Personal-Website/",
  build: {
    chunkSizeWarningLimit: 4000,
  },
  plugins: [react()],
});
