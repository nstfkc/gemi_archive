import { Route } from "@/lib/http/Route";
import { Auth } from "@/lib/http/Auth";

import { AboutController } from "./controllers/AboutController";
import { AuthController } from "./controllers/AuthController";
import { AccountController } from "./controllers/AccountController";
import { HomeController } from "./controllers/HomeController";

class Base {
  protected policies: number[] = [];
  protected table = "";

  create = () => {
    console.log(this.policies, this.table);
  };
}

class Modal extends Base {
  protected table = "user";
}

class TestController extends Modal {
  protected policies = [1, 2];
  index = () => {
    console.log(Auth.user());
    this.create();
    return { data: "hi" };
  };
}

export const api = {
  public: {
    "/test": Route.get([TestController, "index"]),
    "/auth/register": Route.post([AuthController, "register"]),
    "/auth/login": Route.post([AuthController, "login"]),
  },
  private: {
    "/account": Route.get([AccountController, "index"]),
  },
};

export const web = {
  public: {
    "/": Route.view("Home", [HomeController, "index"]),
    "/about": Route.view("About", [AboutController, "index"]),
    "/auth/login": Route.view("auth/Login", [AuthController, "loginView"]),
  },
  private: {
    "/account": Route.view("Account"),
  },
};
