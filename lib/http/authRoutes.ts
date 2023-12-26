import { AuthController } from "@/app/http/controllers/AuthController";

import { Route } from "./Route";

export const authRoutes = {
  view: Route.viewGroup({
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
  api: Route.apiGroup({
    routes: {
      "/sign-in": Route.post([AuthController, "signIn"]),
      "/sign-in/passwordless": Route.post([
        AuthController,
        "signInPasswordless",
      ]),
      "/sign-in/with-token": Route.post([AuthController, "signInWithToken"]),
      "/sign-out": Route.post([AuthController, "signOut"]),
      "/sign-up": Route.post([AuthController, "signUp"]),
      "/:oauth/sign-in": Route.get([AuthController, "oauthSignIn"]),
    },
  }),
};
