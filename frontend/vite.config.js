import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    // Required for ngrok access to Vite dev server
    allowedHosts: [
      "localhost",
      "unadministrative-yer-multijugate.ngrok-free.dev",
    ],

    // Needed for Google OAuth popup flow
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
    proxy: {
      "/api": "http://localhost:8080",
    },

    build: {
      manifest: true, // 🔴 THIS IS THE KEY
      // outDir: "dist",

      emptyOutDir: true,
      rollupOptions: {
        input: "/src/main.jsx",
      },
    },
  },
});
