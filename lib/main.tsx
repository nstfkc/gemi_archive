import { hydrateRoot } from "react-dom/client";
import { App, ServerData } from "./app";
import { renderRoutes } from "./renderRoutes";

declare const window: {
  serverData: string;
} & Window;

const Main = () => {
  const serverData = JSON.parse(window.serverData) as ServerData;
  const render = renderRoutes(serverData.routeManifest);
  return (
    <>
      <></>
      <>
        <App serverData={serverData}>{render}</App>
      </>
    </>
  );
};

hydrateRoot(document.body, <Main />, {});
