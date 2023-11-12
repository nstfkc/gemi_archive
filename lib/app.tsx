import { ComponentType, lazy } from "react";
import { hydrateRoot } from "react-dom/client";
import {
  RouterProvider,
  Route,
  Layout,
  RouteDefinition,
} from "@/lib/client/router";

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
    layout: {
      view: "PublicLayout",
      hasLoader: true,
    },
    routes: {
      "/": {
        view: "Home",
        hasLoader: true,
      },
      "/about": {
        view: "About",
        hasLoader: true,
      },
      "/product": {
        layout: {
          view: "ProductLayout",
          hasLoader: false,
        },
        routes: {
          "/": {
            view: "Product",
            hasLoader: true,
          },
          "/edit": {
            view: "ProductEdit",
            hasLoader: true,
          },
        },
      },
      "/dashboard": {
        layout: {
          view: "DashboardLayout",
          hasLoader: false,
        },
        routes: {
          "/": {
            view: "Dashboard",
            hasLoader: true,
          },
          "/account": {
            view: "Account",
            hasLoader: true,
          },
        },
      },
    },
  },
};

type Route =
  | {
      layout: {
        view: string;
        hasLoader: boolean;
      };
      routes: Record<string, Route>;
    }
  | {
      view: string;
      hasLoader: boolean;
    };

const renderRoutes = (
  routes: Record<string, Route>,
  level = 0,
  parentPath = "",
) => {
  return Object.entries(routes).map(([path, route]) => {
    if ("layout" in route) {
      const { view } = route.layout;
      const Component = lazyViews[`/app/views/${view}.tsx`];
      const layoutPath = `${
        parentPath === "/" ? "" : parentPath
      }/${path}`.replace("//", "/");
      return (
        <Layout
          key={`${level}-${view}`}
          path={layoutPath}
          Component={Component}
          layoutName={view}
        >
          {renderRoutes(route.routes, level + 1, layoutPath)}
        </Layout>
      );
    } else {
      const { view } = route;
      const Component = lazyViews[`/app/views/${view}.tsx`];
      const routePath = [parentPath, level > 0 && path === "/" ? "" : path]
        .join("")
        .replace("//", "/");
      return (
        <Route
          key={`${level}-${path}`}
          level={level}
          path={routePath}
          Component={Component}
        />
      );
    }
  });
};

function getFlatRouteDefinitions(): RouteDefinition[] {
  const flatten = (
    routes: Record<string, Route>,
    output: RouteDefinition[] = [],
    level = 0,
    prevLayouts: string[],
    prevPath = "",
  ) => {
    let out = [...output];
    for (const [path, route] of Object.entries(routes)) {
      if ("layout" in route) {
        const { layout, routes: subRoutes } = route;
        out = flatten(
          subRoutes,
          out,
          level + 1,
          [...prevLayouts, layout.view],
          path,
        );
      } else {
        const routePath = [prevPath, level > 0 && path === "/" ? "" : path]
          .join("")
          .replace("//", "/");

        out.push({
          layout: prevLayouts,
          path: routePath,
          loader: () =>
            fetch(`${routePath}?__json=true`).then((res) => res.json()),
          level,
        });
      }
    }
    return out;
  };

  return flatten(routeManifest, [], -1, []);
}

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const { currentRoute, routeData, layoutData } = JSON.parse(
    window.serverData,
  ) as ServerData;

  return (
    <RouterProvider
      routes={getFlatRouteDefinitions()}
      initialPath={currentRoute}
      initialRouteData={routeData[currentRoute]}
      initialLayoutData={layoutData}
    >
      {renderRoutes(routeManifest)}
    </RouterProvider>
  );
};

hydrateRoot(document.getElementById("app")!, <App />);
