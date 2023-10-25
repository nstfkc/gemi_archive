import { PropsWithChildren } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const App = (props: PropsWithChildren) => {
  let children = props.children;
  if (typeof window !== "undefined") {
    const C = window.component;
    const data = JSON.parse(window.data);
    children = (
      <BrowserRouter>
        <C data={data} />
      </BrowserRouter>
    );
  }
  return <>{children}</>;
};

if (typeof window !== "undefined") {
  document.getElementById("app")!.innerHTML = document
    .getElementById("app")!
    .innerHTML.trim();

  hydrateRoot(document.getElementById("app")!, <App></App>);
}

export default App;
