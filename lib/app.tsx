import { PropsWithChildren } from "react";
import { hydrateRoot } from "react-dom/client";

const App = (props: PropsWithChildren) => {
  let children = props.children;
  if (typeof window !== "undefined") {
    const C = window.component;
    const data = JSON.parse(window.data);
    children = <C data={data} />;
  }
  return (
    <div>
      <h1>Welcome to jaravel</h1>
      {children}
    </div>
  );
};

if (typeof window !== "undefined") {
  document.getElementById("app")!.innerHTML = document
    .getElementById("app")!
    .innerHTML.trim();

  hydrateRoot(document.getElementById("app")!, <App></App>);
}

export default App;
