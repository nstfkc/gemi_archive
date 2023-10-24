import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { App } from "./App";

export default async function (url, context) {
  const { default: C } = await import("./Test.tsx");
  return ReactDOMServer.renderToString(
    <StaticRouter location={url} context={context}>
      <C />
    </StaticRouter>
  );
}
