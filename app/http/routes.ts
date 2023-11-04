import { Route } from "@/lib/http/Route";

import { AboutController } from "./controllers/AboutController";
import { AuthController } from "./controllers/AuthController";
import { AccountController } from "./controllers/AccountController";

export const api = {
  public: {
    "/auth/register": Route.post([AuthController, "register"]),
  },
  private: {
    "/account": Route.get([AccountController, "index"]),
  },
};

export const web = {
  public: {
    "/": Route.view("Home"),
    "/about": Route.view("About", [AboutController, "index"]),
    "/auth/login": Route.view("auth/Login", [AuthController, "loginView"]),
  },
  private: {
    "/account": Route.view("Account"),
  },
};
