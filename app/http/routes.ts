import { Route } from "@/lib/Route";

import { HomeController } from "./controllers/HomeController";

export const routes = {
  "/": Route(HomeController, "index"),
  "/page/:pageId": Route(HomeController, "page"),
  "/foo/:bar/:baz": Route(HomeController, "foo"),
};
