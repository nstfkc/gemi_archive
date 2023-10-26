import type { Response, Request } from "express";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import { routes } from "@/app/http/routes";
import { createRouteMatcher } from "./helpers/routeMatcher";

interface Ctx {
  res: Response;
  req: Request;
}

export async function bootstrap(ctx: Ctx) {
  const { req, res } = ctx;
  const App = (await import("../app")).default;

  const routeMatcher = createRouteMatcher(routes);
  const isRoutePath = req.originalUrl.startsWith("/__route");
  const { match, params } = routeMatcher(
    req.originalUrl.split("?")[0].replace("__route", "").replace("//", "/")
  );

  const route = routes[match];

  if (!route) {
    res.end("404");
  }

  const kind = isRoutePath ? "route" : "html";
  const { viewPath, data } = route({ req, res, params });

  const Children = (await import(`../../app/views/${viewPath}.tsx`)).default;

  if (kind === "route") {
    return {
      viewPath: `app/views/${viewPath}.tsx`,
      kind,
      serverData: {
        data,
      },
      render: () => "",
    };
  }

  return {
    viewPath: `app/views/${viewPath}.tsx`,
    kind,
    serverData: {
      data,
      routes: Object.keys(routes),
      currentRoute: match,
    },
    render: () => {
      return renderToString(
        <App>
          <StaticRouter location={req.originalUrl}>
            <Children data={data} />
          </StaticRouter>
        </App>
      );
    },
  };
}
