import { Hono, Context, Handler } from "hono";
import { serve } from "@hono/node-server";

import { readFileSync } from "node:fs";
import path, { join } from "node:path";

const rootDir = path.resolve(process.cwd());
const libDir = path.join(rootDir, "lib");
const appDir = path.join(rootDir, "app");
const dbDir = path.join(rootDir, "db");

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

  vite.watcher.on("change", (path) => {
    console.log(path);
  });

  const getTemplate = (url: string) =>
    vite.transformIndexHtml(
      url,
      readFileSync(path.resolve(join(rootDir, "index.html")), "utf-8"),
    );

  const app = new Hono();

  app.use(
    "*",
    async (ctx, next) => {
      const res = await fetch(`http://localhost:5174/${ctx.req.path}`, {
        headers: {
          ...(ctx.req.url.includes(".css") ? { accept: "text/css" } : {}),
        },
      });
      if (res.ok) {
        return res;
      } else {
        await next();
      }
    },
    async (ctx) => {
      const { bootstrap } = await vite.ssrLoadModule(
        "/lib/server/bootstrap.tsx",
      );
      const router = bootstrap(getTemplate);

      return await router.fetch(ctx.req.raw);
    },
  );

  await vite.listen(5174);

  serve({
    fetch: app.fetch,
    port: 5173,
  }).on("listening", () => {
    console.log("Server is running");
  });
}

await main();
