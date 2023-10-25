import { defineView } from "../../lib/client/view";
import { Link } from "react-router-dom";

type HomeData = {
  message: string;
};

const Home = (props: { data: HomeData }) => {
  return (
    <div>
      Home Page
      <div>
        <Link to="/about">About</Link>
      </div>
    </div>
  );
};

const view = defineView(Home);
export default view;
