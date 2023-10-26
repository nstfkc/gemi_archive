import type { Response, Request } from "express";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import { routes } from "@/app/http/routes";
import { createRouteMatcher } from "./helpers/routeMatcher";

const views = import.meta.glob(["../../app/views/**/*", "!**/components/*"], {
  eager: true,
});

interface Ctx {
  res: Response;
  req: Request;
}

export async function bootstrap(ctx: Ctx) {
  const { req, res } = ctx;

  const routeMatcher = createRouteMatcher(routes);
  const isRoutePath = req.originalUrl.startsWith("/__route");
  const { match, params } = routeMatcher(
    req.originalUrl.split("?")[0].replace("__route", "").replace("//", "/")
  );

  const route = routes[match];

  if (!route) {
    res.end("404");
  }

  const routeViewMap = Object.fromEntries(
    Object.entries(routes).filter(([, x]) => x?.viewPath)
  );

  const kind = isRoutePath ? "route" : "html";
  const { viewPath, data } = route.exec({ req, res, params });

  const Children = views[`../../app/views/${viewPath}.tsx`].default;

  if (kind === "route") {
    return {
      kind,
      serverData: {
        data,
      },
      render: () => "",
    };
  }

  return {
    kind,
    serverData: {
      routeViewMap,
      data,
      routes: Object.keys(routes),
      currentRoute: match,
    },
    render: () => {
      return renderToString(
        <StaticRouter location={req.originalUrl}>
          <Children data={data} />
        </StaticRouter>
      );
    },
  };
}

export default bootstrap;
