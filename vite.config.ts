import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

/**
 * Pure client-side Vite SPA config for FiveM NUI / YSeries phone.
 *
 * Key points:
 *  - base: './'  →  all asset URLs are relative, required for FiveM CEF and
 *                    cfx-nui:// resource path resolution.
 *  - No SSR, no Nitro, no TanStack Start plugins.
 *  - @tailwindcss/vite compiles Tailwind v4 to plain CSS at build time;
 *    FiveM CEF receives only standard CSS — no oklch / color-mix in output
 *    (those are already patched in styles.css to hex/rgba).
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],

  base: "./",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    // Keep chunk size manageable; FiveM loads from local disk so size is less
    // critical, but reasonable splitting improves parse time.
    chunkSizeWarningLimit: 1500,
  },

  server: {
    port: 3000,
    open: false,
  },
});
