import { Hono } from "hono";
import { serve } from "@hono/node-server";

import { readFileSync } from "node:fs";
import path, { join } from "node:path";
import express, { Router } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { IncomingMessage } from "node:http";

const rootDir = path.resolve(process.cwd());
const libDir = path.join(rootDir, "lib");
const appDir = path.join(rootDir, "app");
const dbDir = path.join(rootDir, "db");

export async function createServer(root = process.cwd()) {
  const app = new Hono();
  // app.use(cookieParser());
  // app.use(bodyParser.json());

  const vite = await (
    await import("vite")
  ).createServer({
    root,
    logLevel: "error",
    server: {
      // middlewareMode: true,
      watch: {
        usePolling: true,
        interval: 100,
      },
      hmr: {
        clientPort: 5174,
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
  vite.listen(5174);

  app.use("/", async (ctx, next) => {
    ctx.req;
    try {
      const template = await vite.transformIndexHtml(
        ctx.req.url,
        readFileSync(path.resolve(join(rootDir, "index.html")), "utf-8"),
      );

      const { bootstrap } = await vite.ssrLoadModule(
        "/lib/server/bootstrap.tsx",
      );

      const router = bootstrap(template) as Router;
      console.log(router);
      return router(ctx);
    } catch (error) {
      const e = error as Error;
      vite.ssrFixStacktrace(e);
      console.log(e.stack);
      ctx.status(500);
      return ctx.text(e.stack);
    }
  });

  app.use("*", async (ctx, next) => {
    const res = await fetch(`http://localhost:5174/${ctx.req.path}`);
    if (res.ok) {
      return res;
    } else {
      next();
    }
  });

  return { app };
}

createServer().then(({ app }) => {
  serve({
    fetch: app.fetch,
    port: 5173,
  });
});
