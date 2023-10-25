import { defineView } from "../../lib/client/view";

type HomeData = {
  message: string;
};

const Home = (props: { data: HomeData }) => {
  return (
    <div>
      <div>{props.data.message}</div>
      <div>
        <a href="/about">About</a>
      </div>
    </div>
  );
};

const view = defineView(Home);
export default view;
