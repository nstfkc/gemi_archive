import { HomeController } from "./controllers/HomeController";
import { Route } from "@/lib/Route";

export const routes = {
  "/": Route(HomeController, "index"),
};
