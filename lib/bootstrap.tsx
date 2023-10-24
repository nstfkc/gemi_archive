import { Response, Request } from "express";
import { renderToString } from "react-dom/server";

interface Ctx {
  res: Response;
  req: Request;
}

export async function bootstrap(_ctx: Ctx) {
  const App = (await import("./app")).default;

  return {
    viewPath: ["lib/app.tsx"],
    kind: "html",
    render: () => renderToString(<App />),
  };
}
