import { Hono } from "hono";
import { serve } from "@hono/node-server";

import { readFileSync } from "node:fs";
import path, { join } from "node:path";
import express, { Router } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { IncomingMessage } from "node:http";
import { log } from "node:console";

const rootDir = path.resolve(process.cwd());
const libDir = path.join(rootDir, "lib");
const appDir = path.join(rootDir, "app");
const dbDir = path.join(rootDir, "db");

export async function createServer(root = process.cwd()) {
  // app.use(cookieParser());
  // app.use(bodyParser.json());
  //

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
  const getTemplate = (url: string) =>
    vite.transformIndexHtml(
      url,
      readFileSync(path.resolve(join(rootDir, "index.html")), "utf-8"),
    );

  const app = new Hono();
  app.use("*", async (ctx, next) => {
    console.log(ctx.req.url);
    const { bootstrap } = await vite.ssrLoadModule("/lib/server/bootstrap.tsx");
    const router = bootstrap(getTemplate);
    const route = router(ctx);
    if (route) {
      return route.handler(ctx, next);
    } else {
      const res = await fetch(`http://localhost:5174/${ctx.req.path}`);
      if (res.ok) {
        return res;
      } else {
        next();
      }
    }
  });
  // app.use("/", bootstrapModule.bootstrap(getTemplate)());
  // try {
  //   const router = bootstrap(getTemplate) as Router;
  //   return await router(ctx);
  // } catch (error) {
  //   const e = error as Error;
  //   vite.ssrFixStacktrace(e);
  //   console.log(e.stack);
  //   ctx.status(500);
  //   return ctx.text(e.stack);
  // }

  // vite.watcher.add("/lib/server/bootstrap.tsx");
  // vite.watcher.on("change", () => {
  //   console.log("changed");
  //   vite.reloadModule({
  //     file:''
  //   });
  // });

  serve({
    fetch: app.fetch,
    port: 5173,
  });
}

createServer();
