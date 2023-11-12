// import { Context } from "hono";

import { Route, ViewRoute, ViewRouteGroup } from "@/lib/http/Route";

// import { AuthController } from "./controllers/AuthController";
// import { AccountController } from "./controllers/AccountController";
import { HomeController } from "./controllers/HomeController";
import { AboutController } from "./controllers/AboutController";
import { PublicLayoutController } from "./controllers/PublicLayoutController";
import { DashboardController } from "./controllers/DashboardController";
import { AccountController } from "./controllers/AccountController";
import { ProductController } from "./controllers/ProductController";
import { RouteManifest } from "@/lib/types/global";

export const api = {
  public: {
    // "/test/:id?": Route.get([TestController, "index"]),
    // "/auth/register": Route.post([AuthController, "register"]),
    // "/auth/login": Route.post([AuthController, "login"]),
  },
  private: {
    // "/account": Route.get([AccountController, "index"]),
  },
};

// const layout = Route.layout("PublicLayout", [PublicLayoutController, "index"]);
// const products = Route.viewGroup(
//   Route.layout("PublicLayout", [PublicLayoutController, "index"]),
//   {
//     "/edit": Route.view("Home", [HomeController, "index"]),
//     "/test": Route.viewGroup(
//       Route.layout("PublicLayout", [PublicLayoutController, "index"]),
//       {
//         "/:id": Route.view("Home", [HomeController, "index"]),
//       },
//     ),
//   },
// );

type WebRoutes<T> = Record<string, ViewRoute<T> | ViewRouteGroup<T>>;

function createWebRoutes<T>(routes: WebRoutes<T>) {
  const createRouteManifest = <U>(
    _routes: Record<string, ViewRoute<U> | ViewRouteGroup<T>> = routes,
  ): RouteManifest => {
    const out: RouteManifest = {};

    for (const [path, section] of Object.entries(_routes)) {
      if (section.kind === "group") {
        out[path] = {
          layout: {
            view: section.layoutPath,
            hasLoader: !!section.handler,
          },
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

export const web = createWebRoutes({
  "/": Route.viewGroup(
    Route.layout("PublicLayout", [PublicLayoutController, "index"]),
    {
      "/": Route.view("Home", [HomeController, "index"]),
      "/params/:test": Route.view("Params", [HomeController, "index"]),
      "/params/:test/edit": Route.view("Params", [HomeController, "index"]),
      "/about": Route.view("About", [AboutController, "index"]),
      "/dashboard": Route.viewGroup(Route.layout("DashboardLayout"), {
        "/": Route.view("Dashboard", [DashboardController, "index"]),
        "/account": Route.view("Account", [AccountController, "index"]),
      }),
      "/product": Route.viewGroup(Route.layout("ProductLayout"), {
        "/": Route.view("Product", [ProductController, "index"]),
        "/edit": Route.view("Account", [ProductController, "edit"]),
      }),
    },
  ),
});
