import fs from "fs";
import path from "path";
import express from "express";
import react from "@vitejs/plugin-react-swc";
import { createServer, build, defineConfig } from "vite";

const getAssets = async (input) => {
  const result = await build(
    defineConfig({
      plugins: [react()],
      build: {
        minify: false,
        rollupOptions: {
          input,
        },
      },
    })
  );

  console.log(result.output.map(({ code, ...rest }) => rest));
  const scripts = result.output
    .map(
      (out) =>
        `<script type="module" src="http://localhost:5173/${out.fileName}"></script>`
    )
    .join("\n");

  return {
    scripts,
  };
};

const rootDir = path.resolve(process.cwd());
const assetsDir = path.join(rootDir, "dist/assets");
const libDir = path.join(rootDir, "lib");
const bootstrapPath = path.join(libDir, "bootstrap");

async function main() {
  const app = express();

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("/assets", express.static(assetsDir));

  app.use("*", async (req, res, next) => {
    try {
      let template = fs.readFileSync(path.join(rootDir, "index.html"), "utf-8");

      const { bootstrap } = await vite.ssrLoadModule(bootstrapPath);
      const { viewPath, kind, render } = await bootstrap({ req, res });

      if (kind === "html") {
        const { scripts } = await getAssets(viewPath);
        const appHtml = await render();
        const html = template.replace(`<!--ssr-outlet-->`, appHtml.trim());
        const htmlWithScripts = html.replace(`<!--scripts-->`, `${scripts}`);
        res
          .status(200)
          .set({ "Content-Type": "text/html" })
          .end(htmlWithScripts);
      }
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(5173);
}

main();
