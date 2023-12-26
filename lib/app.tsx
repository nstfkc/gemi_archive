// @app import
import { Root } from "@/app/views/root";

import { PropsWithChildren } from "react";
import { RouterProvider, RouteDefinition } from "@/lib/client/router";
import { RouteManifest } from "./types/global";

export interface ServerData {
  routeManifest: RouteManifest;
  currentRoute: string;
  currentUrl: string;
  routeData: Record<string, Readonly<unknown>>;
  layoutData: Record<string, Readonly<unknown>>;
}

function getFlatRouteDefinitions(
  routeManifest: RouteManifest,
): RouteDefinition[] {
  const flatten = (
    routeManifest: RouteManifest,
    output: RouteDefinition[] = [],
    level = 0,
    prevLayouts: string[],
    prevPath = "",
  ) => {
    let out = [...output];
    for (const [path, route] of Object.entries(routeManifest)) {
      if ("layout" in route) {
        const { layout, routes: subRoutes } = route;
        out = flatten(
          subRoutes,
          out,
          level + 1,
          layout ? [...prevLayouts, layout.view] : [...prevLayouts],
          path,
        );
      } else {
        const routePath = [prevPath, level > 0 && path === "/" ? "" : path]
          .join("")
          .replace("//", "/");

        out.push({
          layout: prevLayouts,
          path: routePath,
          loader: (path: string) =>
            fetch(`${path}?__json=true`).then((res) => res.json()),
          level,
        });
      }
    }
    return out;
  };

  return flatten(routeManifest, [], -1, []);
}

export const App = (props: PropsWithChildren<{ serverData: ServerData }>) => {
  const { serverData, children } = props;
  const { currentRoute, routeData, layoutData, routeManifest, currentUrl } =
    serverData;

  return (
    <Root>
      <RouterProvider
        routes={getFlatRouteDefinitions(routeManifest)}
        initialPath={currentRoute}
        initialUrl={currentUrl}
        initialRouteData={routeData[currentRoute]}
        initialLayoutData={layoutData}
      >
        {children}
      </RouterProvider>
    </Root>
  );
};
