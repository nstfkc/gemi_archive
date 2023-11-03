// vite.config.js
import path from "node:path";
import { defineConfig } from "file:///Users/enes/Workspace/gemijs/node_modules/.pnpm/vite@4.5.0_@types+node@20.8.10/node_modules/vite/dist/node/index.js";
import react from "file:///Users/enes/Workspace/gemijs/node_modules/.pnpm/@vitejs+plugin-react-swc@3.4.1_vite@4.5.0/node_modules/@vitejs/plugin-react-swc/index.mjs";
import typescript from "file:///Users/enes/Workspace/gemijs/node_modules/.pnpm/@rollup+plugin-typescript@11.1.5_lm22yqt35mpsf6p6j6ge5grecu/node_modules/@rollup/plugin-typescript/dist/es/index.js";
var rootDir = path.resolve(process.cwd());
var libDir = path.join(rootDir, "lib");
var appDir = path.join(rootDir, "app");
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/lib": libDir,
      "@/app": appDir
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZW5lcy9Xb3Jrc3BhY2UvZ2VtaWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZW5lcy9Xb3Jrc3BhY2UvZ2VtaWpzL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9lbmVzL1dvcmtzcGFjZS9nZW1panMvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCB0eXBlc2NyaXB0IGZyb20gXCJAcm9sbHVwL3BsdWdpbi10eXBlc2NyaXB0XCI7XG5cbmNvbnN0IHJvb3REaXIgPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSk7XG5jb25zdCBsaWJEaXIgPSBwYXRoLmpvaW4ocm9vdERpciwgXCJsaWJcIik7XG5jb25zdCBhcHBEaXIgPSBwYXRoLmpvaW4ocm9vdERpciwgXCJhcHBcIik7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkAvbGliXCI6IGxpYkRpcixcbiAgICAgIFwiQC9hcHBcIjogYXBwRGlyLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1EsT0FBTyxVQUFVO0FBQ3ZSLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLGdCQUFnQjtBQUV2QixJQUFNLFVBQVUsS0FBSyxRQUFRLFFBQVEsSUFBSSxDQUFDO0FBQzFDLElBQU0sU0FBUyxLQUFLLEtBQUssU0FBUyxLQUFLO0FBQ3ZDLElBQU0sU0FBUyxLQUFLLEtBQUssU0FBUyxLQUFLO0FBRXZDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxTQUFTO0FBQUEsTUFDVCxTQUFTO0FBQUEsSUFDWDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
