import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import typescript from "@rollup/plugin-typescript";

const rootDir = path.resolve(process.cwd());
const libDir = path.join(rootDir, "lib");
const appDir = path.join(rootDir, "app");

export default defineConfig({
  plugins: [typescript()],
  build: {
    ssr: true,
    outDir: "dist/lib/server",
    rollupOptions: {
      input: "/lib/server/bootstrap.tsx",
    },
  },

  resolve: {
    alias: {
      "@/lib": libDir,
      "@/app": appDir,
    },
  },
});
