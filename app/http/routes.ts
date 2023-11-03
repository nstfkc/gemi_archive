import { Route } from "@/lib/server/Route";

import { AboutController } from "./controllers/AboutController";
import { AuthController } from "./controllers/AuthController";

export const api = {
  "/auth/register": Route.post(AuthController, "register"),
};

export const web = {
  "/": Route.view("Home", () => {
    return { message: "Hello World" };
  }),
  "/about": Route.view("About", [AboutController, "index"]),
  "/auth/login": Route.view("auth/Login", [AuthController, "loginView"]),
};
