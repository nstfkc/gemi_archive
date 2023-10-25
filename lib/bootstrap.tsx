import { Response, Request } from "express";
import { renderToString } from "react-dom/server";

import { routes } from "@/app/http/routes";
import { createRouteMatcher } from "./helpers/routeMatcher";

interface Ctx {
  res: Response;
  req: Request;
}

export async function bootstrap(ctx: Ctx) {
  const { req, res } = ctx;
  const App = (await import("./app")).default;

  const routeMatcher = createRouteMatcher(routes);
  const { match, params } = routeMatcher(req.originalUrl.split("?")[0]);

  console.log({ params });
  const route = routes[match];

  if (!route) {
    res.end("404");
  }
  const handler = routes[match];
  const { kind, viewPath, data } = handler({ req, res, params });

  const Children = (await import(`../app/views/${viewPath}`)).default;

  return {
    viewPath: ["lib/app.tsx", `app/views/${viewPath}.tsx`],
    data,
    kind: "html",
    render: () => {
      return renderToString(
        <App>
          <Children data={data} />
        </App>
      );
    },
  };
}
