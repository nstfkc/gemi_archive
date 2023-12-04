import { ComponentType, lazy } from "react";
import { RouteManifest } from "./types/global";
import { Layout, Route } from "./client/router";

const views = import.meta.glob([
  "@/app/views/**/*",
  "!**/components/**/*",
  "!**/root.tsx",
]) as Record<string, () => Promise<{ default: ComponentType<unknown> }>>;

const lazyViews = Object.fromEntries(
  Object.entries(views).map(([key, loaderFn]) => [key, lazy(loaderFn)]),
);

export const renderRoutes = (
  routes: RouteManifest,
  level = 0,
  parentPath = "",
) => {
  const res = Object.entries(routes).map(([path, route]) => {
    if ("layout" in route) {
      const layoutPath = `${
        parentPath === "/" ? "" : parentPath
      }/${path}`.replace("//", "/");

      if (!route.layout) {
        return (
          <Layout
            key={`${level}`}
            path={layoutPath}
            Component={({ children }) => <>{children}</>}
            layoutName={""}
          >
            {renderRoutes(route.routes, level + 1, layoutPath)}
          </Layout>
        );
      } else {
        const { view } = route.layout;
        const Component = lazyViews[`/app/views/${view}.tsx`];

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
      }
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

  return res;
};
