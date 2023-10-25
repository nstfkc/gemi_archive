import { useState } from "react";
import { defineView } from "../../lib/client/view";

type HomeData = {
  message: string;
};

const Home = (props: { data: HomeData }) => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <div>{props.data.message}</div>
      <button onClick={() => setCount((s) => s + 1)}>{count}</button>
    </div>
  );
};

export default defineView(Home);
