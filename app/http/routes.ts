// import { Context } from "hono";

import { Route } from "@/lib/http/Route";

// import { AuthController } from "./controllers/AuthController";
// import { AccountController } from "./controllers/AccountController";
import { HomeController } from "./controllers/HomeController";

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

export const web = {
  public: {
    "/": Route.view("Home", [HomeController, "index"]),
    // "/about": Route.view("About", [AboutController, "index"]),
    // "/auth/login": Route.view("auth/Login", [AuthController, "loginView"]),
  },
  private: {
    // "/account": Route.view("Account"),
  },
};
