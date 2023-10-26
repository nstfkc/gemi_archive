import { Route } from "@/lib/server/Route";

import { HomeController } from "./controllers/HomeController";
import { AboutController } from "./controllers/AboutController";

console.log("ROUTES");

export const routes = {
  "/": Route.view("Home", [HomeController, "index"]),
  "/about": Route.view("About", [AboutController, "index"]),
  "/x": Route.get(HomeController, "index"),
};
