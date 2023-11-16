import { Controller } from "@/lib/http/Controller";
import { Context } from "hono";

export class DashboardController extends Controller {
  index(ctx: Context) {
    console.log(ctx.get("jwtPayload"));
    return { message: "Dashboard Message" };
  }
}
