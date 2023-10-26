import { hydrateRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const views = import.meta.glob(["@/app/views/**/*", "!**/components/*"], {
  eager: true,
});

function createRoutes() {
  const { routeViewMap } = JSON.parse(window.serverData);
  return (
    <>
      <Route path="/" Component={views["/app/views/Home.tsx"].default} />,
      <Route path="/about" Component={views["/app/views/About.tsx"].default} />
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
