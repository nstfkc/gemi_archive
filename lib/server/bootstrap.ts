import { Hono } from "hono";

import { api, web } from "@/app/http/routes";
import { createApiRoutes, createViewRoutes } from "../http/createViewRoutes";
import { ViewRoute, ViewRouteGroup } from "../http/Route";
import { RouteManifest } from "../types/global";

type WebRoutes<T> = Record<string, ViewRoute<T> | ViewRouteGroup<T>>;

function createWebRoutes<T>(routes: WebRoutes<T>) {
  const createRouteManifest = <U>(
    _routes: Record<string, ViewRoute<U> | ViewRouteGroup<T>> = routes,
  ): RouteManifest => {
    const out: RouteManifest = {};

    for (const [path, section] of Object.entries(_routes)) {
      if (section.kind === "group") {
        out[path] = {
          layout: section.layoutPath
            ? {
                view: section.layoutPath,
                hasLoader: !!section.handler,
              }
            : null,
          routes: createRouteManifest(section.routes ?? {}),
        };
      }

      if (section.kind === "view") {
        out[path] = {
          view: section.viewPath,
          hasLoader: section.hasLoader,
        };
      }
    }

    return out;
  };

  return {
    routes,
    manifest: createRouteManifest(routes),
  };
}

export function bootstrap(template: string) {
  const app = new Hono();

  const { manifest, routes } = createWebRoutes(web);

  createApiRoutes(app, "/api", api);

  createViewRoutes(app, "/", { template, routeManifest: manifest }, routes);

  app.get("__routes", (ctx) => ctx.json(app.routes));

  return app;
}
