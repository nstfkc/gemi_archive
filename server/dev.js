import { readFileSync } from "node:fs";
import path, { join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cookieParser from "cookie-parser";
import { json } from "body-parser";

// import bootstrap from "@/lib/server/bootstrap";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rootDir = path.resolve(process.cwd());
const libDir = path.join(rootDir, "lib");
const appDir = path.join(rootDir, "app");
const dbDir = path.join(rootDir, "db");

export async function createServer(root = process.cwd()) {
  const resolve = (p) => path.resolve(__dirname, p);

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

  const { webPaths, handleView } = (
    await vite.ssrLoadModule("/lib/server/bootstrap.tsx")
  ).default;

  webPaths.map((path) => {
    app.get(path, async (req, res) => {
      const template = await vite.transformIndexHtml(
        req.originalUrl,
        readFileSync(resolve(join(rootDir, "index.html")), "utf-8"),
      );
      const handler = handleView(path, template);
      const html = await handler(req, res);
      console.log(html);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    });
  });

  // await bootstrap(app, getTemplate, (e) => {
  //   vite.ssrFixStacktrace(e);
  //   console.log(e.stack);
  // });

  return { app };
}

createServer().then(({ app }) =>
  app.listen(5173, () => {
    console.log("http://localhost:5173");
  }),
);
