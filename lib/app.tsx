import { hydrateRoot } from "react-dom/client";
import { RouterProvider, Route } from "@/lib/client/router";

const views = import.meta.glob(["@/app/views/**/*", "!**/components/*"], {
  eager: true,
});

const App = () => {
  const { routeViewMap, currentRoute } = JSON.parse(window.serverData);
  return (
    <RouterProvider initialPath={currentRoute}>
      {Object.entries(routeViewMap).map(([path, { viewPath }]) => {
        const Component = views[`/app/views/${viewPath}.tsx`].default;
        return <Route key={path} Component={Component} path={path} />;
      })}
    </RouterProvider>
  );
};

hydrateRoot(document.getElementById("app")!, <App />);
