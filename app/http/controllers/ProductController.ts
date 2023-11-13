import { Controller } from "@/lib/http/Controller";
import { Context } from "hono";

export class ProductController extends Controller {
  index = () => {
    return { productTitle: "Iphone 15" };
  };
  edit = (ctx: Context) => {
    return { action: `Edit Iphone 15 ${ctx.req.param("productId")}` };
  };
}
