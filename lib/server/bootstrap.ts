import { Hono } from "hono";

import { api, web } from "@/app/http/routes";
import { createApiRoutes, createViewRoutes } from "../http/createViewRoutes";

export function bootstrap(template: string) {
  const app = new Hono();

  createApiRoutes(app, "/", api);

  createViewRoutes(
    app,
    "/",
    { template, routeManifest: web.manifest },
    web.routes,
  );

  const routes = app.routes;

  app.get("__routes", (ctx) => ctx.json(routes));

  return app;
}
