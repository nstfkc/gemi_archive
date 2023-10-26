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

function getViews() {
  let files = [];

  const getFiles = (dir) => {
    const filesInDir = fs.readdirSync(dir);

    filesInDir.forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        if (!filePath.includes("/components")) {
          getFiles(filePath);
        }
      } else {
        files.push(filePath);
      }
    });
  };

  getFiles(path.join(appDir, "views"));
  return files;
}

const getAssets = async (input) => {
  const result = await build(
    defineConfig({
      plugins: [react()],
      resolve: {
        alias: {
          "@/lib/server": path.join(libDir, "client"),
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

  const scripts = result.output.map(({ _code, ...rest }) => rest);

  return {
    scripts,
  };
};

const viewManifest = await getAssets([...(await getViews()), "lib/app.tsx"]);

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
      const { viewPath, kind, render, serverData } = await bootstrap({
        req,
        res,
      });

      if (kind === "html") {
        const appHtml = await render();

        const s = viewManifest.scripts
          .map((sc) => {
            if (sc?.facadeModuleId?.includes("app/views/")) {
              if (sc.facadeModuleId.includes(viewPath)) {
                return sc;
              }
            } else {
              return sc;
            }
          })
          .filter((m) => typeof m !== "undefined");

        const html = template.replace(`<!--ssr-outlet-->`, appHtml.trim());

        const routeManifest = viewManifest.scripts
          .filter(
            (s) => s.facadeModuleId && s.facadeModuleId.includes("app/views")
          )
          .map(({ fileName, name, imports }) => ({ fileName, name, imports }));

        const allScripts = [
          ...s.map(
            ({ fileName }) =>
              `<script type="module" src="http://localhost:5173/${fileName}"></script>`
          ),
          `<script type="module" src="http://localhost:5173/@vite/client"></script>`,
          `<script>window.serverData = '${JSON.stringify(
            serverData
          )}'; window.routeManifest = '${JSON.stringify(
            routeManifest
          )}'</script>`,
        ].join("\n");

        const htmlWithScripts = html.replace(`<!--scripts-->`, allScripts);

        res
          .status(200)
          .set({ "Content-Type": "text/html" })
          .end(htmlWithScripts);
      } else {
        res.json({
          view: viewPath.replace("app/views/", "").split(".")[0],
          data: serverData.data,
        });
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
