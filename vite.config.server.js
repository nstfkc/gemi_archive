import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import typescript from "@rollup/plugin-typescript";

const rootDir = path.resolve(process.cwd());
const libDir = path.join(rootDir, "lib");
const appDir = path.join(rootDir, "app");
const dbDir = path.join(rootDir, "db");

export default defineConfig({
  build: {
    ssr: true,
    outDir: "dist/server",
    rollupOptions: {
      input: "/server/prod.ts",
      external: ["bun"],
    },
  },
  resolve: {
    alias: {
      "@/lib": libDir,
      "@/app": appDir,
      "@/db": dbDir,
    },
  },
});
