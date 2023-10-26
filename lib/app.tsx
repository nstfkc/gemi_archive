import { PropsWithChildren } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "@/app/views/About";
import Home from "@/app/views/Home";

const App = (props: PropsWithChildren) => {
  let children = props.children;
  if (typeof window !== "undefined") {
    children = (
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/about" Component={About} />
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
