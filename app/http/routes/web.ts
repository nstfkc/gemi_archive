import { Route } from "@/lib/http/Route";

import { HomeController } from "../controllers/HomeController";
import { AboutController } from "../controllers/AboutController";
import { PublicLayoutController } from "../controllers/PublicLayoutController";
import { DashboardController } from "../controllers/DashboardController";
import { AppLayoutController } from "../controllers/AppLayoutController";
import { authRoutes } from "@/lib/http/authRoutes";

export default {
  "/": Route.viewGroup({
    layout: Route.layout("PublicLayout", [PublicLayoutController, "index"]),
    routes: {
      "/": Route.view("Home", [HomeController, "index"], {}),
      "/about": Route.view("About", [AboutController, "index"]),
    },
  }),
  "/app": Route.viewGroup({
    layout: Route.layout("AppLayout", [AppLayoutController, "index"]),
    middlewares: ["auth"],
    routes: {
      "/dashboard": Route.view("Dashboard", [DashboardController, "index"]),
    },
  }),
  "/auth": authRoutes.view,
  "/*": Route.view("404"),
};
