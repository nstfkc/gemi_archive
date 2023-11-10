import { Hono, Handler } from "hono";
import { getCookie } from "hono/cookie";

import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { verify } from "jsonwebtoken";
import { renderToString } from "react-dom/server";
import { api, web } from "@/app/http/routes";
import { RouterContext } from "../http/RouterContext";
import { AuthContext } from "../http/AuthContext";

const views = import.meta.glob(["@/app/views/**/*", "!**/components/*"], {
  eager: true,
});

const routeViewMap = Object.fromEntries([
  ...Object.entries(web.public).map(([key, routeList]) => {
    return [
      key,
      { viewPath: routeList.viewPath, hasLoader: routeList.hasLoader },
    ];
  }),
  ...Object.entries(web.private).map(([key, routeList]) => {
    return [key, { viewPath: routeList.viewPath, hasLoader: true }];
  }),
]);

const viewDataHandler = (_path: string, handler: any): Handler => {
  return async (ctx) => {
    const { data } = await handler.exec(ctx);
    return ctx.json(data);
  };
};

const apiHandler = (_path: string, handler: any): Handler => {
  return async (ctx) => {
    const { data } = await handler.exec(ctx);
    return ctx.json(data);
  };
};

const viewRouteAuthMiddleware =
  (handler: Handler): Handler =>
  (ctx, next) => {
    if (getCookie(ctx, "auth") === "true") {
      return handler(ctx, next);
    } else {
      return ctx.redirect("/auth/login");
    }
  };

const viewJsonRouteAuthMiddleware =
  (handler: Handler): Handler =>
  (ctx, next) => {
    if (getCookie(ctx, "auth") === "true") {
      return handler(ctx, next);
    } else {
      return ctx.json({ redirect: "/auth/login" });
    }
  };

const apiRouteAuthMiddleware =
  (handler: Handler): Handler =>
  (ctx, next) => {
    if (getCookie(ctx, "auth") === "true") {
      return handler(ctx, next);
    } else {
      return ctx.json({ success: false, error: { message: "Not authorized" } });
    }
  };

export function bootstrap(template: string) {
  const app = new Hono();
  Object.entries(web.public).forEach(([path, handler]) => {
    app.get(path, async (ctx) => {
      const { data, render } = await handler.handler(ctx, path, template);
      if (ctx.req.param("__json") === "true") {
        return ctx.json(data);
      }
      const html = render(data, path, template, routeViewMap);
      return ctx.html(html);
    });
  });

  /* app.all((ctx, next) => {
   *   return RouterContext.run({ ctx }, async () => {
   *     await next();
   *   });
   * });

   * Object.entries(api.public).forEach(([path, handler]) => {
   *   app[handler.method](`/api${path}`, apiHandler(path, handler));
   * });

   * Object.entries(api.private).forEach(([path, handler]) => {
   *   app[handler.method](
   *     `/api${path}`,
   *     apiRouteAuthMiddleware(apiHandler(path, handler)),
   *   );
   * });

   * Object.entries(web.public).forEach(([path, handler]) => {
   *   app.get(`/__json${path}`, viewDataHandler(path, handler));
   *   app.get(path, viewHandler(path, handler, template));
   * });

   * Object.entries(web.private).forEach(([path, handler]) => {
   *   app.get(
   *     `/__json${path}`,
   *     viewJsonRouteAuthMiddleware(viewDataHandler(path, handler)),
   *   );
   *   app.get(
   *     path,
   *     viewRouteAuthMiddleware(viewHandler(path, handler, template)),
   *   );
   * });
   */
  return app;
}
