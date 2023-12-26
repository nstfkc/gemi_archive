import { serve } from "bun";
import { Hono } from "hono";
import path from "node:path";
import { parseFile, updateManifest } from "./helpers";
import { renderToReadableStream } from "react-dom/server";

const scripts = `<script type="module">
  import RefreshRuntime from 'http://localhost:5173/@react-refresh'
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
</script>`;

const rootDir = process.cwd();
const libDir = path.join(rootDir, "lib");
const appDir = path.join(rootDir, "app");
const dbDir = path.join(rootDir, "db");
const debugDir = path.join(rootDir, "debug");

export async function main() {
  const root = process.cwd();

  const vite = await (
    await import("vite")
  ).createServer({
    root,
    logLevel: "error",
    server: {
      watch: {
        usePolling: true,
        interval: 100,
      },
      hmr: {
        clientPort: 5174,
      },
    },
    build: {
      ssrManifest: true,
      manifest: true,
      ssrEmitAssets: true,
      rollupOptions: {
        input: "/lib/main.tsx",
      },
    },
    appType: "custom",
    resolve: {
      alias: {
        "@/lib": libDir,
        "@/app": appDir,
        "@/db": dbDir,
      },
    },
  });

  vite.watcher.on("change", async (filePath) => {
    if (filePath.includes("Controller")) {
      const parsed = await parseFile(filePath);
      updateManifest(parsed);
    }
  });

  const app = new Hono();

  app.use(
    "*",
    async (ctx, next) => {
      const res = await fetch(`http://localhost:5174/${ctx.req.path}`);
      if (res.ok) {
        return res;
      } else {
        await next();
      }
    },
    async (ctx) => {
      const { bootstrap } = await vite.ssrLoadModule(
        "/lib/server/bootstrap.ts",
      );

      const styles = [];

      for (const [file, modules] of vite.moduleGraph.fileToModulesMap) {
        for (const mod of modules) {
          if (mod.file.includes(".css")) {
            const { default: css } = await vite.ssrLoadModule(file);
            styles.push(
              `<style type="text/css" data-vite-dev-id="${mod.file}">${css}</style>`,
            );
          }
        }
      }

      const router = bootstrap(
        renderToReadableStream,
        styles.join("\n"),
        scripts,
      );

      return await router.fetch(ctx.req.raw);
    },
  );

  await vite.listen(5174);

  process.env.DEBUG_DIR = debugDir;
  process.env.APP_DIR = appDir;

  serve({
    fetch: app.fetch,
    port: 5173,
  });
}

await main();
