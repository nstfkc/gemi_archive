import { Route, ViewRoute, ViewRouteGroup } from "@/lib/http/Route";
import { HomeController } from "./controllers/HomeController";
import { AboutController } from "./controllers/AboutController";
import { PublicLayoutController } from "./controllers/PublicLayoutController";
import { DashboardController } from "./controllers/DashboardController";
import { AccountController } from "./controllers/AccountController";
import { ProductController } from "./controllers/ProductController";
import { RouteManifest } from "@/lib/types/global";

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

const productRoutes = Route.viewGroup({
  middlewares: [],
  routes: {
    "/:productId": Route.view("Product", [ProductController, "index"]),
    "/:productId/edit": Route.view("ProductEdit", [ProductController, "edit"]),
  },
});

const dashboardRoutes = Route.viewGroup({
  layout: Route.layout("DashboardLayout"),
  routes: {
    "/": Route.view("Dashboard", [DashboardController, "index"]),
    "/account": Route.view("Account", [AccountController, "index"]),
  },
});

export const web = createWebRoutes({
  "/": Route.viewGroup({
    layout: Route.layout("PublicLayout", [PublicLayoutController, "index"]),
    routes: {
      "/": Route.view("Home", [HomeController, "index"]),
      "/about": Route.view("About", [AboutController, "index"]),
      "/dashboard": dashboardRoutes,
      "/product": productRoutes,
    },
  }),
});

export const api = {
  "/products": Route.get([ProductController, "list"]),
};
