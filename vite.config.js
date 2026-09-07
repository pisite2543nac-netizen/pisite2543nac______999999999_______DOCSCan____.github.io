import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative paths make the built site work under:
  // https://USERNAME.github.io/REPOSITORY/
  base: "./",
  server: {
    port: 5174,
    strictPort: true
  },
  preview: {
    port: 4174,
    strictPort: true
  }
});
