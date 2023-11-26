import { Route } from "@/lib/http/Route";
import { HomeController } from "./controllers/HomeController";
import { AboutController } from "./controllers/AboutController";
import { PublicLayoutController } from "./controllers/PublicLayoutController";
import { ProductController } from "./controllers/ProductController";
import { AuthController } from "./controllers/AuthController";

export const web = {
  "/": Route.viewGroup({
    layout: Route.layout("PublicLayout", [PublicLayoutController, "index"]),
    routes: {
      "/": Route.view("Home", [HomeController, "index"], {}),
      "/about": Route.view("About", [AboutController, "index"]),
    },
  }),
  "/auth": Route.viewGroup({
    routes: {
      "/sign-in": Route.view("auth/SignIn"),
      "/sign-up": Route.view("auth/SignUp"),
    },
  }),
  // "/:id": Route.view("Product", [ProductController, "edit"]),
  "/*": Route.view("404"),
};

export const api = {
  "/auth": Route.apiGroup({
    routes: {
      "/sign-in": Route.post([AuthController, "signIn"]),
      "/sign-out": Route.post([AuthController, "signOut"]),
      "/sign-up": Route.post([AuthController, "signUp"]),
    },
  }),
  "/test/:id?": Route.post([ProductController, "test1"]),
  "/products": Route.get([ProductController, "list"]),
};
