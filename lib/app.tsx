import { hydrateRoot } from "react-dom/client";
import { RouterProvider } from "@/lib/client/router";

import "@/app/global.css";

declare const window: {
  serverData: string;
} & Window;

interface ServerData {
  routeViewMap: Record<string, { viewPath: string }>;
  currentRoute: string;
  routeData: Record<string, Readonly<unknown>>;
}

const views: Record<string, { default: <T>(p: T) => JSX.Element }> =
  import.meta.glob(["@/app/views/**/*", "!**/components/*"], {
    eager: true,
  });

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const { routeViewMap, currentRoute, routeData } = JSON.parse(
    window.serverData,
  ) as ServerData;
  return (
    <RouterProvider
      initialPath={currentRoute}
      initialRouteData={routeData[currentRoute]}
      routes={Object.entries(routeViewMap).map(([path, { viewPath }]) => {
        const Component = views[`/app/views/${viewPath}.tsx`].default;
        return {
          Component,
          loader: () => fetch(`/__json/${path}`).then((res) => res.json()),
          path,
        };
      })}
    />
  );
};

hydrateRoot(document.getElementById("app")!, <App />);
