import { Context } from "hono";
import { Middleware } from "./Middleware";

export class AuthMiddleware extends Middleware {
  handle(ctx: Context, next: VoidFunction) {
    return ctx.json({ unauthorized: true });
  }
}
