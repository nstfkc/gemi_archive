import { defineView } from "@/lib/client/view";
import { Link } from "react-router-dom";

type AboutData = {
  message: string;
};

const About = (props: { data: AboutData }) => {
  return (
    <div>
      <div>About page</div>
      <div>
        <Link to="/">Home Route</Link>
      </div>
    </div>
  );
};

const view = defineView(About);
export default view;
