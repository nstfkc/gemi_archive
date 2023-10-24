import ReactDOMServer from "react-dom/server";

export default async function (C) {
  return ReactDOMServer.renderToString(<C />);
}
