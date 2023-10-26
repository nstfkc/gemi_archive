import { PropsWithChildren } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

let views = {};

if (!import.meta.env.SSR) {
  views = import.meta.glob(["@/app/views/**/*", "!**/components/*"], {
    eager: true,
  });
}

const App = (props: PropsWithChildren) => {
  let children = props.children;
  if (typeof window !== "undefined") {
    console.log(views);
    children = (
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={views["/app/views/Home.tsx"].default} />,
          <Route
            path="/about"
            Component={views["/app/views/About.tsx"].default}
          />
        </Routes>
      </BrowserRouter>
    );
  }
  return <>{children}</>;
};

if (typeof window !== "undefined") {
  hydrateRoot(document.getElementById("app")!, <App />);
}

export default App;
