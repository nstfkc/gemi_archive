import { Route } from "@/lib/http/Route";
import { HomeController } from "./controllers/HomeController";
import { AboutController } from "./controllers/AboutController";
import { PublicLayoutController } from "./controllers/PublicLayoutController";
import { DashboardController } from "./controllers/DashboardController";
import { AccountController } from "./controllers/AccountController";
import { ProductController } from "./controllers/ProductController";
import { AuthController } from "./controllers/AuthController";

const productRoutes = Route.viewGroup({
  middlewares: [],
  routes: {
    "/:productId": Route.view("Product", [ProductController, "index"]),
    "/:productId/edit": Route.view("ProductEdit", [ProductController, "edit"]),
  },
});

const dashboardRoutes = Route.viewGroup({
  middlewares: ["auth"],
  layout: Route.layout("DashboardLayout"),
  routes: {
    "/": Route.view("Dashboard", [DashboardController, "index"]),
    "/account": Route.view("Account", [AccountController, "index"]),
  },
});

export const web = {
  "/": Route.viewGroup({
    layout: Route.layout("PublicLayout", [PublicLayoutController, "index"]),
    routes: {
      "/": Route.view("Home", [HomeController, "index"], {}),
      "/about": Route.view("About", [AboutController, "index"]),
      "/dashboard": dashboardRoutes,
      "/product": productRoutes,
    },
  }),
  "/auth": Route.viewGroup({
    routes: {
      "/login": Route.view("auth/Login", [AuthController, "loginView"]),
    },
  }),
};

export const api = {
  "/auth": Route.apiGroup({
    routes: {
      "/login": Route.post([AuthController, "login"]),
      "/logout": Route.post([AuthController, "logout"]),
    },
  }),
  "/products": Route.get([ProductController, "list"]),
  "/test": Route.apiGroup({
    middlewares: ["auth"],
    routes: {
      "/enes": Route.get([ProductController, "list"]),
      "/subc": Route.get([ProductController, "list"]),
    },
  }),
};
