import { hydrateRoot } from "react-dom/client";
import { App, ServerData, renderRoutes } from "./app";

declare const window: {
  serverData: string;
} & Window;

const Main = () => {
  const serverData = JSON.parse(window.serverData) as ServerData;
  const render = renderRoutes(serverData.routeManifest);
  return <App serverData={serverData}>{render}</App>;
};

hydrateRoot(document.getElementById("app")!, <Main />);
