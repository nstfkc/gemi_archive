import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import express, { Router } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { bootstrap } from "../lib/server/bootstrap";

export async function createServer(root = process.cwd()) {
  const app = express();
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use((await import("compression")).default());
  app.use(
    (await import("serve-static")).default(resolve("dist/client"), {
      index: false,
    }),
  );

  app.use((req, res, next) => {
    try {
      const template = readFileSync(
        resolve(join(root, "dist/client/index.html")),
        "utf-8",
      );

      const router = bootstrap(template) as Router;
      return router(req, res, next);
    } catch (error) {
      const e = error as Error;
      console.log(e.stack);
      return res.status(500).end("Temporary server error 500");
    }
  });

  return { app };
}

createServer().then(({ app }) => {
  app.listen(5173, () => {
    console.log("http://localhost:5173");
  });
});
