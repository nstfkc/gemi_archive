import "reflect-metadata";
import type { Response, Request } from "express";
import { renderToString } from "react-dom/server";

import { routes } from "@/app/http/routes";
import { createRouteMatcher } from "./helpers/routeMatcher";
import { storage } from "./storage";
import { executionAsyncId } from "node:async_hooks";

const views: Record<string, { default: <T>(p: T) => JSX.Element }> =
  import.meta.glob(["../../app/views/**/*", "!**/components/*"], {
    eager: true,
  });

interface Ctx {
  res: Response;
  req: Request;
}

export async function bootstrap(ctx: Ctx) {
  const { req, res } = ctx;

  const routeMatcher = createRouteMatcher(routes);
  const isJSONRequest = req.originalUrl.startsWith("/__json");
  const { match, params } = routeMatcher(
    req.originalUrl.split("?")[0].replace("/__json", "").replace("//", "/"),
  );

  const matchedRoutes = Array.isArray(routes[match])
    ? routes[match]
    : [routes[match]];

  const route = matchedRoutes.find((r) => r.method === req.method);

  if (typeof route.exec !== "function") {
    return res.send("404");
  }

  const { viewPath, data } = await storage.run(
    { request: req, response: res },
    async () => {
      return await route.exec({
        req,
        res,
        params,
      });
    },
  );

  if (isJSONRequest || route.json) {
    return {
      isJSONRequest: true,
      serverData: {
        data,
      },
      render: () => "",
    };
  }

  if (!viewPath) {
    return {
      render: () => "",
      serverData: { data: {} },
    };
  }

  if (data.redirect) {
    return {
      serverData: {
        redirect: data.redirect,
        status: 304,
      },
    };
  }

  const routeViewMap = Object.fromEntries(
    Object.entries(routes).map(([key, routeList]) => {
      if (Array.isArray(routeList)) {
        return [
          key,
          {
            viewPath: (routeList.find((r) => (r as any)?.viewPath) as any)
              ?.viewPath,
          },
        ];
      }
      return [key, { viewPath: routeList.viewPath }];
    }),
  );

  const Children = views[`../../app/views/${viewPath}.tsx`].default;

  return {
    isJSONRequest: false,
    serverData: {
      routeViewMap,
      routeData: { [match]: data },
      routes: Object.keys(routes),
      currentRoute: match,
    },
    render: () => {
      return renderToString(<Children data={data} />);
    },
  };
}

export default bootstrap;
