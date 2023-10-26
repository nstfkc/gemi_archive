import { defineView } from "@/lib/client/view";
import { Link } from "react-router-dom";

type AboutData = {
  message: string;
};

const About = (props: { data: AboutData }) => {
  return (
    <div>
      <div>About page test asd 1234</div>
      <div>
        <Link to="/">Home Route</Link>
      </div>
    </div>
  );
};

const view = defineView(About);
export default view;
