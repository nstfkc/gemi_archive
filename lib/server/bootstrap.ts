import { Hono } from "hono";

import { api, web } from "@/app/http/routes";
import { createViewRoutes } from "../http/createViewRoutes";

function createRouteViewMap(
  routes: typeof web.public,
  parentPath = "",
  layout: any = null,
  prevResult: any = null,
) {
  let out = { ...prevResult };

  for (const [key, routeList] of Object.entries(routes)) {
    if (routeList.kind === "group") {
      out = {
        ...out,
        ...createRouteViewMap(
          routeList.routes,
          `${parentPath}${key}`.replace(/\/$/, ""),
          routeList.layoutPath,
          out,
        ),
      };
    } else {
      out[`${parentPath}${key}`] = {
        viewPath: routeList.viewPath,
        hasLoader: routeList.hasLoader,
        layout,
      };
    }
  }

  return out;
}

export function bootstrap(template: string) {
  const app = new Hono();
  const routeViewMap = createRouteViewMap(web.public);
  createViewRoutes(app, { template, routeViewMap }, web.public);

  return app;
}
