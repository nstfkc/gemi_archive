import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = path.resolve(process.cwd());
const libDir = path.join(rootDir, "lib");
const appDir = path.join(rootDir, "app");

export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
  },
  resolve: {
    alias: {
      "@/lib": libDir,
      "@/app": appDir,
    },
  },
});
