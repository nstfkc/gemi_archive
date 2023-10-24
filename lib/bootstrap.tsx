import { Response, Request } from "express";
import { renderToString } from "react-dom/server";

import { routes } from "@/app/http/routes";

interface Ctx {
  res: Response;
  req: Request;
}

export async function bootstrap(_ctx: Ctx) {
  const App = (await import("./app")).default;

  const route = routes["/"];

  return {
    viewPath: ["lib/app.tsx"],
    kind: "html",
    render: () => {
      console.log();
      const res = route(_ctx.req, _ctx.res);
      return `${res}${renderToString(<App />)}`;
    },
  };
}
