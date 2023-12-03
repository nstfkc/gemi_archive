import { serve } from "bun";
import { serveStatic } from "hono/bun";

import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { bootstrap } from "../lib/server/bootstrap";

const root = process.cwd();

const template = readFileSync(
  resolve(join(root, "dist/client/index.html")),
  "utf-8",
);

const router = bootstrap(template, (app) => {
  app.use(
    "/:filename{.+\\.(png|txt|js|css|jpg|svg|jpeg)$}",
    serveStatic({ root: "./dist/client" }),
  );
});

serve({
  fetch: router.fetch,
  port: 5173,
});
