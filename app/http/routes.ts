import { Route } from "@/lib/server/Route";

import { HomeController } from "./controllers/HomeController";
import { AboutController } from "./controllers/AboutController";

export const routes = {
  "/": Route(HomeController, "index"),
  "/about": Route(AboutController, "index"),
};
