import { serve } from "bun";
import { serveStatic } from "hono/bun";

import { join } from "node:path";
import { bootstrap } from "../lib/server/bootstrap";
import { renderToReadableStream } from "react-dom/server";
import manifest from "../dist/client/manifest.json";

const rootDir = process.cwd();
const appDir = join(rootDir, "app");
const debugDir = join(rootDir, "debug");

const router = bootstrap(
  renderToReadableStream,
  `<link rel="stylesheet" href="/${manifest["lib/main.tsx"].css}" />`,
  `<script type="module" src="/${manifest["lib/main.tsx"].file}"></script>`,
  (app) => {
    app.use(
      "/:filename{.+\\.(png|txt|js|css|jpg|svg|jpeg)$}",
      serveStatic({ root: "./dist/client" }),
    );
  },
);

process.env.DEBUG_DIR = debugDir;
process.env.APP_DIR = appDir;

serve({
  fetch: router.fetch,
  port: 5173,
});
