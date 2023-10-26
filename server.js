import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isTest = process.env.VITEST;

const rootDir = path.resolve(process.cwd());
const assetsDir = path.join(rootDir, "dist/assets");
const libDir = path.join(rootDir, "lib");
const appDir = path.join(rootDir, "app");
const bootstrapPath = path.join(libDir, "server/bootstrap");

export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
  hmrPort
) {
  const resolve = (p) => path.resolve(__dirname, p);

  const indexProd = isProd
    ? fs.readFileSync(resolve("dist/client/index.html"), "utf-8")
    : "";

  const app = express();

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await (
      await import("vite")
    ).createServer({
      root,

      logLevel: isTest ? "error" : "info",
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: "custom",
      resolve: {
        alias: {
          "@/lib": libDir,
          "@/app": appDir,
        },
      },
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    app.use((await import("compression")).default());
    app.use(
      (await import("serve-static")).default(resolve("dist/client"), {
        index: false,
      })
    );
  }

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;

      let template, bootstrap;
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve("index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        bootstrap = (await vite.ssrLoadModule("/lib/server/bootstrap.tsx"))
          .default;
      } else {
        template = indexProd;
        bootstrap = (await import("./dist/lib/server/bootstrap.js")).default;
      }

      const context = {};
      const { render, serverData } = await bootstrap({ req, res });
      const appHtml = render(url, context);

      // if (context.url) {
      //   // Somewhere a `<Redirect>` was rendered
      //   return res.redirect(301, context.url);
      // }

      const scripts = `<script>window.serverData=${JSON.stringify(
        serverData
      )}<script/>`;

      const html = template.replace(`<!--app-html-->`, appHtml).concat(scripts);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      !isProd && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(5173, () => {
      console.log("http://localhost:5173");
    })
  );
}
