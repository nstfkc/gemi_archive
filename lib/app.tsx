import { ComponentType, lazy } from "react";
import { hydrateRoot } from "react-dom/client";
import { RouterProvider, Route, Layout } from "@/lib/client/router";

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
  layoutData: Record<string, Readonly<unknown>>;
}

const views = import.meta.glob([
  "@/app/views/**/*",
  "!**/components/*",
]) as Record<string, () => Promise<{ default: ComponentType<unknown> }>>;

const lazyViews = Object.fromEntries(
  Object.entries(views).map(([key, loaderFn]) => [key, lazy(loaderFn)]),
);

const routeManifest = {
  "/": {
    layout: "PublicLayout",
    routes: {
      "/": {
        view: "Home",
        hasLoader: true,
      },
      "/about": {
        view: "About",
        hasLoader: true,
      },
    },
  },
};

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const { currentRoute, routeData, layoutData } = JSON.parse(
    window.serverData,
  ) as ServerData;

  return (
    <RouterProvider
      routes={[
        {
          level: 0,
          path: "/",
          layout: ["PublicLayout"],
          loader: () => fetch(`/?__json=true`).then((res) => res.json()),
        },
        {
          level: 0,
          path: "/about",
          layout: ["PublicLayout"],
          loader: () => fetch(`/about?__json=true`).then((res) => res.json()),
        },
      ]}
      initialPath={currentRoute}
      initialRouteData={routeData[currentRoute]}
      initialLayoutData={layoutData}
    >
      {Object.entries(routeManifest).map(([path, { layout, routes }]) => {
        const LayoutComponent = lazyViews[`/app/views/${layout}.tsx`];
        return (
          <Layout
            Component={LayoutComponent}
            layoutName={layout}
            path={path}
            key={path}
          >
            {Object.entries(routes).map(([subPath, { view }]) => {
              const Component = lazyViews[`/app/views/${view}.tsx`];
              return (
                <Route
                  level={0}
                  key={subPath}
                  path={`${path}${subPath}`.replace("//", "/")}
                  Component={Component}
                />
              );
            })}
          </Layout>
        );
      })}
    </RouterProvider>
  );
};

hydrateRoot(document.getElementById("app")!, <App />);
