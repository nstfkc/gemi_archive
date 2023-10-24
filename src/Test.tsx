import { useState } from "react";
import { hydrateRoot } from "react-dom/client";

const Test = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((s) => s + 1)}>{count}</button>;
};

if (typeof document !== "undefined") {
  document.getElementById("app")!.innerHTML = document
    .getElementById("app")!
    .innerHTML.trim();
  hydrateRoot(document.getElementById("app")!, <Test />);
}

export default Test;
