import { Route } from "@/lib/http/Route";
import { Auth } from "@/lib/http/Auth";

import { AboutController } from "./controllers/AboutController";
import { AuthController } from "./controllers/AuthController";
import { AccountController } from "./controllers/AccountController";

class TestController {
  index = () => {
    console.log(Auth.user());
    return { data: "hi" };
  };
}

export const api = {
  public: {
    "/test": Route.get([TestController, "index"]),
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
