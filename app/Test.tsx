import { useState } from "react";

const Test = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((s) => s + 1)}>Count: {count}</button>;
};

export default Test;
