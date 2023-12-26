import { serve } from "bun";
import { serveStatic } from "hono/bun";

import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { bootstrap } from "../lib/server/bootstrap";
import { renderToReadableStream } from "react-dom/server";
import manifest from "../dist/client/manifest.json";

console.log({ manifest });

const root = process.cwd();
const rootDir = process.cwd();
const appDir = join(rootDir, "app");
const debugDir = join(rootDir, "debug");

const router = bootstrap(
  ``,
  (app) => {
    app.use(
      "/:filename{.+\\.(png|txt|js|css|jpg|svg|jpeg)$}",
      serveStatic({ root: "./dist/client" }),
    );
  },
  renderToReadableStream,
  `<link rel="stylesheet" href="/${manifest["lib/main.tsx"].css}" />`,
  `<script type="module" src="/${manifest["lib/main.tsx"].file}"></script>`,
);

process.env.DEBUG_DIR = debugDir;
process.env.APP_DIR = appDir;

serve({
  fetch: router.fetch,
  port: 5173,
});
