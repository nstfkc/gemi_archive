import { Hono } from "hono";

import { api, web } from "@/app/http/routes";
import { createViewRoutes } from "../http/createViewRoutes";

const routeViewMap = Object.fromEntries([
  ...Object.entries(web.public).map(([key, routeList]) => {
    return [
      key,
      { viewPath: routeList.viewPath, hasLoader: routeList.hasLoader },
    ];
  }),
  ...Object.entries(web.private).map(([key, routeList]) => {
    return [key, { viewPath: routeList.viewPath, hasLoader: true }];
  }),
]);

export function bootstrap(template: string) {
  const app = new Hono();

  createViewRoutes(app, { template, routeViewMap }, web.public);

  return app;
}
