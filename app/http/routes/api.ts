import { Route } from "@/lib/http/Route";
import { authRoutes } from "@/lib/http/authRoutes";

import { ProductController } from "../controllers/ProductController";

export default {
  "/auth": authRoutes.api,
  "/product": Route.apiGroup({
    middlewares: ["auth"],
    routes: {
      "/:productId": Route.get([ProductController, "show"]),
      "": Route.post([ProductController, "create"]),
    },
  }),
};
