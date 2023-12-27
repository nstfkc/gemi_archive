import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

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
      external: ["bun", "react-native"],
    },
  },
  resolve: {
    alias: {
      "react-native": "react-native-web",
      "@/lib": libDir,
      "@/app": appDir,
      "@/db": dbDir,
    },
  },
});
