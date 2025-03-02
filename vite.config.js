import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ Alias for easy imports
    },
  },
  optimizeDeps: {
    include: ["firebase/app", "firebase/firestore"], // ✅ Ensure Firebase is optimized for dev mode
  },
  build: {
    rollupOptions: {
      external: ["firebase"], // ✅ Avoid Firebase bundling issues
    },
    commonjsOptions: {
      transformMixedEsModules: true, // ✅ Support both ESM & CJS modules
    },
  },
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 5173,
    strictPort: true,
  },
});
