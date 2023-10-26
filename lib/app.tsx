import { hydrateRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const views = import.meta.glob(["@/app/views/**/*", "!**/components/*"], {
  eager: true,
});

function createRoutes() {
  const { routeViewMap } = JSON.parse(window.serverData);
  return (
    <>
      {Object.entries(routeViewMap).map(([path, { viewPath }]) => (
        <Route
          key={path}
          path={path}
          Component={views[`/app/views/${viewPath}.tsx`].default}
        />
      ))}
    </>
  );
}

const App = () => {
  const routes = createRoutes();
  return (
    <BrowserRouter>
      <Routes>{routes}</Routes>
    </BrowserRouter>
  );
};

if (typeof window !== "undefined") {
  hydrateRoot(document.getElementById("app")!, <App />);
}

export default App;
