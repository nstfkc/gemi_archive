import { PropsWithChildren } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DynamicRoute } from "./client/DynamicRoute";

const App = (props: PropsWithChildren) => {
  let children = props.children;
  if (typeof window !== "undefined") {
    const { data, routes, currentRoute } = JSON.parse(window.serverData);

    window.views = {};
    if (!window.views[currentRoute]) {
      window.views[currentRoute] = window.component;
    }

    const C = window.views[currentRoute];
    const element = <C data={data} />;
    children = (
      <BrowserRouter>
        <Routes>
          <Route path={currentRoute} element={element} />

          {(routes as string[])
            .filter((r) => r !== currentRoute)
            .map((r) => {
              return (
                <Route
                  key={r}
                  path={r}
                  element={<DynamicRoute fallback={element} path={r} />}
                />
              );
            })}
        </Routes>
      </BrowserRouter>
    );
  }
  return <>{children}</>;
};

if (typeof window !== "undefined") {
  document.getElementById("app")!.innerHTML = document
    .getElementById("app")!
    .innerHTML.trim();

  hydrateRoot(document.getElementById("app")!, <App />);
}

export default App;
