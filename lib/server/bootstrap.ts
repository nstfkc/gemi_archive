import { Hono } from "hono";

import { api, web } from "@/app/http/routes";
import { createViewRoutes } from "../http/createViewRoutes";
import { RouteManifest } from "../types/global";

const createRouteManifest = (routes: typeof web.public): RouteManifest => {
  const out = {};

  for (let [path, section] of Object.entries(routes)) {
    if (section.kind === "group") {
      out[path] = {
        layout: {
          view: section.layoutPath,
          hasLoader: false,
        },
        routes: createRouteManifest(section.routes),
      };
    } else {
      out[path] = {
        view: section.viewPath,
        hasLoader: section.hasLoader,
      };
    }
  }

  return out;
};

export function bootstrap(template: string) {
  const app = new Hono();
  const routeManifest = createRouteManifest(web.public);

  createViewRoutes(app, { template, routeManifest }, web.public);

  return app;
}
