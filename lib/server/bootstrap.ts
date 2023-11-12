import { Hono } from "hono";

import { api, web } from "@/app/http/routes";
import { createViewRoutes } from "../http/createViewRoutes";

export function bootstrap(template: string) {
  const app = new Hono();

  createViewRoutes(app, { template, routeManifest: web.manifest }, web.routes);

  return app;
}
