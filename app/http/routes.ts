import { Route } from "@/lib/server/Route";

import { AboutController } from "./controllers/AboutController";
import { AuthController } from "./controllers/AuthController";

export const routes = {
  "/": Route.view("Home"),
  "/about": Route.view("About", [AboutController, "index"]),

  "/auth/login": [
    Route.view("auth/Login", [AuthController, "loginView"]),
    Route.post(AuthController, "login"),
  ],
  "/auth/register": [Route.post(AuthController, "register")],
};
