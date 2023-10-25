import { defineView } from "@/lib/client/view";
import { Button } from "./components/Button";

type AboutData = {
  message: string;
};

const About = (props: { data: AboutData }) => {
  return (
    <div>
      <div>{props.data.message}</div>
      <div>
        <a href="/">Home Route</a>
      </div>
    </div>
  );
};

const view = defineView(About);
export default view;
