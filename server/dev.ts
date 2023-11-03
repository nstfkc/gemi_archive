import { readFileSync } from "node:fs";
import path, { join } from "node:path";
import express, { Router } from "express";
import cookieParser from "cookie-parser";
import { json } from "body-parser";

const rootDir = path.resolve(process.cwd());
const libDir = path.join(rootDir, "lib");
const appDir = path.join(rootDir, "app");
const dbDir = path.join(rootDir, "db");

export async function createServer(root = process.cwd()) {
  const app = express();
  app.use(cookieParser());
  app.use(json());

  const vite = await (
    await import("vite")
  ).createServer({
    root,
    logLevel: "error",
    server: {
      middlewareMode: true,
      watch: {
        usePolling: true,
        interval: 1000,
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

  app.use(vite.middlewares);

  app.use(async (req, res, next) => {
    try {
      const template = await vite.transformIndexHtml(
        req.url,
        readFileSync(path.resolve(join(rootDir, "index.html")), "utf-8"),
      );

      const { bootstrap } = await vite.ssrLoadModule(
        "/lib/server/bootstrap.tsx",
      );

      const router = bootstrap(template) as Router;
      return router(req, res, next);
    } catch (error) {
      const e = error as Error;
      vite.ssrFixStacktrace(e);
      console.log(e.stack);
      return res.status(500).end(e.stack);
    }
  });

  return { app };
}

createServer().then(({ app }) => {
  app.listen(5173, () => {
    console.log("http://localhost:5173");
  });
});
