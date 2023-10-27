import { hydrateRoot } from "react-dom/client";
import { RouterProvider, Route } from "@/lib/client/router";

import "@/app/global.css";

const views = import.meta.glob(["@/app/views/**/*", "!**/components/*"], {
  eager: true,
});

const App = () => {
  const { routeViewMap, currentRoute, routeData } = JSON.parse(
    window.serverData,
  );
  return (
    <RouterProvider
      initialPath={currentRoute}
      initialRouteData={routeData[currentRoute]}
      routes={
        Object.entries(routeViewMap).map(([path, { viewPath }]) => {
          const Component = views[`/app/views/${viewPath}.tsx`].default;
          return {
            Component,
            loader: () => fetch(`/__json/${path}`).then((res) => res.json()),
            path,
          };
        }) as any
      }
    />
  );
};

hydrateRoot(document.getElementById("app")!, <App />);
