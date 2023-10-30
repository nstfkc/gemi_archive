import { Route } from "@/lib/server/Route";

import { HomeController } from "./controllers/HomeController";
import { AboutController } from "./controllers/AboutController";
import { AuthController } from "./controllers/AuthController";

export const routes = {
  "/": Route.view("Home", [HomeController, "index"]),
  "/about": Route.view("About", [AboutController, "index"]),

  "/auth/login": [
    Route.view("auth/Login", [AuthController, "loginView"]),
    Route.post(AuthController, "login"),
  ],
  "/auth/register": [Route.post(AuthController, "register")],
};
