import fs from "fs";
import path from "path";
import express from "express";
import react from "@vitejs/plugin-react-swc";
import { createServer, build, defineConfig } from "vite";

const rootDir = path.resolve(process.cwd());
const assetsDir = path.join(rootDir, "dist/assets");
const libDir = path.join(rootDir, "lib");
const appDir = path.join(rootDir, "app");
const bootstrapPath = path.join(libDir, "server/bootstrap");

const getAssets = async (input) => {
  const result = await build(
    defineConfig({
      plugins: [react()],
      resolve: {
        alias: {
          "@/lib": libDir,
          "@/app": appDir,
        },
      },
      build: {
        minify: false,
        rollupOptions: {
          input,
        },
      },
    })
  );

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

async function main() {
  const app = express();

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    resolve: {
      alias: {
        "@/lib": libDir,
        "@/app": appDir,
      },
    },
  });

  app.use(vite.middlewares);

  app.use("/assets", express.static(assetsDir));

  app.use("*", async (req, res, next) => {
    try {
      let template = fs.readFileSync(path.join(rootDir, "index.html"), "utf-8");

      const { bootstrap } = await vite.ssrLoadModule(bootstrapPath);
      const { viewPath, kind, data, render } = await bootstrap({ req, res });

      if (kind === "html") {
        const { scripts } = await getAssets(viewPath);
        const appHtml = await render();
        const html = template.replace(`<!--ssr-outlet-->`, appHtml.trim());
        const dataString = JSON.stringify(data);

        const allScripts = scripts.concat(
          `<script type="module" src="http://localhost:5173/@vite/client"></script>
<script>window.data = '${dataString}'</script>`
        );
        const htmlWithScripts = html.replace(`<!--scripts-->`, allScripts);

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
