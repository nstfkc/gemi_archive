import { Route } from "@/lib/http/Route";
import { HomeController } from "./controllers/HomeController";
import { AboutController } from "./controllers/AboutController";
import { PublicLayoutController } from "./controllers/PublicLayoutController";
import { ProductController } from "./controllers/ProductController";
import { AuthController } from "./controllers/AuthController";
import { DashboardController } from "./controllers/DashboardController";
import { AppLayoutController } from "./controllers/AppLayoutController";

export const web = {
  "/": Route.viewGroup({
    layout: Route.layout("PublicLayout", [PublicLayoutController, "index"]),
    routes: {
      "/": Route.view("Home", [HomeController, "index"], {}),
      "/about": Route.view("About", [AboutController, "index"]),
    },
  }),
  "/app": Route.viewGroup({
    layout: Route.layout("AppLayout", [AppLayoutController, "index"]),
    middlewares: ["auth"],
    routes: {
      "/dashboard": Route.view("Dashboard", [DashboardController, "index"]),
      "/products/:productId": Route.view("ProductEdit", [
        ProductController,
        "edit",
      ]),
    },
  }),
  "/auth": Route.viewGroup({
    routes: {
      "/sign-in": Route.view("auth/SignIn", [AuthController, "signInView"]),
      "/sign-up": Route.view("auth/SignUp"),
      "/magic-link": Route.view("auth/MagicLink", [
        AuthController,
        "signInWithMagicLink",
      ]),
      "/:oauth/callback": Route.view("auth/OAuthCallback"),
    },
  }),
  "/*": Route.view("404"),
};

export const api = {
  "/auth": Route.apiGroup({
    routes: {
      "/sign-in": Route.post([AuthController, "signIn"]),
      "/sign-in/passwordless": Route.post([
        AuthController,
        "signInPasswordless",
      ]),
      "/sign-out": Route.post([AuthController, "signOut"]),
      "/sign-up": Route.post([AuthController, "signUp"]),
      "/:oauth/sign-in": Route.get([AuthController, "oauthSignIn"]),
    },
  }),
  "/product": Route.apiGroup({
    middlewares: ["auth"],
    routes: {
      "/:productId": Route.get([ProductController, "show"]),
      "": Route.post([ProductController, "create"]),
    },
  }),
};
