// import { Context } from "hono";

import { Route } from "@/lib/http/Route";

// import { AuthController } from "./controllers/AuthController";
// import { AccountController } from "./controllers/AccountController";
import { HomeController } from "./controllers/HomeController";
import { AboutController } from "./controllers/AboutController";
import { PublicLayoutController } from "./controllers/PublicLayoutController";

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

// const layout = Route.layout("PublicLayout", [PublicLayoutController, "index"]);
// const products = Route.viewGroup(
//   Route.layout("PublicLayout", [PublicLayoutController, "index"]),
//   {
//     "/edit": Route.view("Home", [HomeController, "index"]),
//     "/test": Route.viewGroup(
//       Route.layout("PublicLayout", [PublicLayoutController, "index"]),
//       {
//         "/:id": Route.view("Home", [HomeController, "index"]),
//       },
//     ),
//   },
// );

export const web = {
  public: {
    "/": Route.viewGroup(
      Route.layout("PublicLayout", [PublicLayoutController, "index"]),
      {
        "/": Route.view("Home", [HomeController, "index"]),
        "/about": Route.view("About", [AboutController, "index"]),
      },
    ),
  },
  private: {
    // "/account": Route.view("Account"),
  },
};
