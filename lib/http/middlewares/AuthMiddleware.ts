import { Context } from "hono";
import { getCookie } from "hono/cookie";
import { decode, verify } from "hono/jwt";

import { Middleware } from "./Middleware";
import { AuthenticatedUser } from "@/lib/types/global";

export class AuthMiddleware extends Middleware {
  async handle(ctx: Context, next: VoidFunction) {
    const token = getCookie(ctx, "Authorization");
    if (typeof token === "string") {
      const isTokenValid = (await verify(
        token,
        process.env.SECRET ?? "secret",
      )) as Boolean;

      if (isTokenValid) {
        const user = decode(token).payload as AuthenticatedUser;

        if (user) {
          ctx.set("jwtPayload", user);
          return next();
        }
      }
    } else {
      ctx.status(401);
      if (ctx.req.method === "GET" && !ctx.req.path.startsWith("/api")) {
        if (ctx.req.query("__json")) {
          return ctx.json({
            success: false,
            error: { name: "AuthenticationError" },
          });
        }
        return ctx.redirect("/auth/sign-in");
      } else {
        return ctx.json({
          success: false,
          error: { name: "AuthenticationError" },
        });
      }
    }
  }
}
