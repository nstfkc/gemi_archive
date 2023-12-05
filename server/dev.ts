import { serve } from "bun";
import { Hono } from "hono";
import { readFileSync } from "node:fs";
import path, { join } from "node:path";
import { TypescriptParser } from "typescript-parser";
import { parseFile, updateManifest } from "./helpers";

const rootDir = process.cwd();
const libDir = path.join(rootDir, "lib");
const appDir = path.join(rootDir, "app");
const dbDir = path.join(rootDir, "db");
const debugDir = path.join(rootDir, "debug");

const parser = new TypescriptParser();

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
      const template = await vite.transformIndexHtml(
        ctx.req.url,
        readFileSync(path.resolve(join(rootDir, "index.html")), "utf-8"),
      );
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
        template.replace("<!--css-entry-->", styles.join("\n")),
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
