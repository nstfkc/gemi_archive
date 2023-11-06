import { ComponentType, lazy } from "react";
import { hydrateRoot } from "react-dom/client";
import { RouterProvider } from "@/lib/client/router";

import "@/app/global.css";

declare const window: {
  serverData: string;
} & Window;

interface ServerData {
  routeViewMap: Record<string, { viewPath: string; hasLoader: boolean }>;
  currentRoute: string;
  routeData: Record<string, Readonly<unknown>>;
}

const views = import.meta.glob([
  "@/app/views/**/*",
  "!**/components/*",
]) as Record<string, () => Promise<{ default: ComponentType<unknown> }>>;

const lazyViews = Object.fromEntries(
  Object.entries(views).map(([key, loaderFn]) => [key, lazy(loaderFn)]),
);

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const { routeViewMap, currentRoute, routeData } = JSON.parse(
    window.serverData,
  ) as ServerData;

  console.log({ routeViewMap, currentRoute, routeData });
  return (
    <RouterProvider
      initialPath={currentRoute}
      initialRouteData={routeData[currentRoute]}
      routes={Object.entries(routeViewMap).map(
        ([path, { viewPath, hasLoader }]) => {
          const Component = lazyViews[`/app/views/${viewPath}.tsx`];
          return {
            Component,
            loader: hasLoader
              ? () => fetch(`/__json${path}`).then((res) => res.json())
              : null,
            path,
          };
        },
      )}
    />
  );
};

hydrateRoot(document.getElementById("app")!, <App />);
