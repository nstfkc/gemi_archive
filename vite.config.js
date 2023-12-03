import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const rootDir = path.resolve(process.cwd());
const libDir = path.join(rootDir, "lib");
const appDir = path.join(rootDir, "app");

export default defineConfig({
  plugins: [react()],
  build: {
    ssrEmitAssets: true,
    manifest: true,
  },
  resolve: {
    alias: {
      "@/lib": libDir,
      "@/app": appDir,
    },
  },
});
