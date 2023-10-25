import { PropsWithChildren } from "react";
import { hydrateRoot } from "react-dom/client";

const App = (props: PropsWithChildren) => {
  return (
    <div>
      <h1>Welcome to jaravel</h1>
      {props.children}
    </div>
  );
};

/* if (typeof document !== "undefined") {
 *   document.getElementById("app")!.innerHTML = document
 *     .getElementById("app")!
 *     .innerHTML.trim();
 *   hydrateRoot(document.getElementById("app")!, <App />);
 * } */

export default App;
