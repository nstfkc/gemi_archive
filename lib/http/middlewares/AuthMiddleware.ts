import { Context } from "hono";
import { getCookie } from "hono/cookie";
import { decode, verify } from "hono/jwt";

import { Middleware } from "./Middleware";

export class AuthMiddleware extends Middleware {
  async handle(ctx: Context, next: VoidFunction) {
    const tokenSrc =
      ctx.req.header("Authorization") ?? getCookie(ctx, "Authorization");
    const token = tokenSrc?.replace("Bearer ", "");

    if (token) {
      const isValid = (await verify(token, "secret")) as boolean;
      if (isValid) {
        ctx.set("jwtPayload", decode(token));
      }
      if (isValid) {
        return next();
      }
    }

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
