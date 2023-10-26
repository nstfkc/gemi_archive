import type { Response, Request } from "express";
import { renderToString } from "react-dom/server";

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
  const isJSONRequest = req.originalUrl.startsWith("/__json");
  const { match, params } = routeMatcher(
    req.originalUrl.split("?")[0].replace("/__json", "").replace("//", "/"),
  );

  const route = routes[match];

  if (!route) {
    res.end("404");
  }

  const { viewPath, data } = route.exec({ req, res, params });

  if (isJSONRequest) {
    return {
      isJSONRequest: true,
      serverData: {
        data,
      },
      render: () => "",
    };
  }

  const routeViewMap = Object.fromEntries(
    Object.entries(routes).filter(([, x]) => x?.viewPath),
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
