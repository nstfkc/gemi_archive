import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { bootstrap } from "../lib/server/bootstrap";

const root = process.cwd();

const template = readFileSync(
  resolve(join(root, "dist/client/index.html")),
  "utf-8",
);

const router = bootstrap(template);

router.use("*", serveStatic({ root: "./dist/client" }));

serve({
  fetch: router.fetch,
  port: 5173,
});
