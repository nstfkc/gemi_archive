import { Context } from "hono";
import { Middleware } from "./Middleware";

export class AuthMiddleware extends Middleware {
  async handle(ctx: Context, next: VoidFunction) {
    ctx.status(401);
    if (ctx.req.method === "GET" && !ctx.req.path.startsWith("/api")) {
      if (ctx.req.query("__json")) {
        return ctx.json({ unauthorized: true });
      }
      return ctx.redirect("/auth/login");
    } else {
      return ctx.json({ unauthorized: true });
    }
  }
}
