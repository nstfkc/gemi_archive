import { hydrateRoot } from "react-dom/client";
import Test from "../src/Test";

const App = () => {
  return (
    <div>
      <h1>Welcome to jaravel</h1>
      <Test />
    </div>
  );
};

if (typeof document !== "undefined") {
  document.getElementById("app")!.innerHTML = document
    .getElementById("app")!
    .innerHTML.trim();
  hydrateRoot(document.getElementById("app")!, <App />);
}

export default App;
