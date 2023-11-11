import { ComponentType, lazy } from "react";
import { hydrateRoot } from "react-dom/client";
import { RouterProvider } from "@/lib/client/router";

import "@/app/global.css";

declare const window: {
  serverData: string;
} & Window;

interface ServerData {
  routeViewMap: Record<
    string,
    { viewPath: string; hasLoader: boolean; layout: string }
  >;
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

  return (
    <RouterProvider
      initialPath={currentRoute}
      initialRouteData={routeData[currentRoute]}
      layouts={Object.fromEntries(
        Object.entries(routeViewMap).map(([path, { layout }]) => [
          path,
          lazyViews[`/app/views/${layout}.tsx`],
        ]),
      )}
      routes={Object.entries(routeViewMap).map(
        ([path, { viewPath, hasLoader }]) => {
          const Component = lazyViews[`/app/views/${viewPath}.tsx`];
          return {
            Component,
            loader: hasLoader
              ? () => fetch(`${path}?__json=true`).then((res) => res.json())
              : null,
            path,
          };
        },
      )}
    />
  );
};

hydrateRoot(document.getElementById("app")!, <App />);
