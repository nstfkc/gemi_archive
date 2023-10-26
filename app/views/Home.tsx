import { Link } from "@/lib/client/router";

type HomeData = {
  message: string;
};

const Home = (props: { data: HomeData }) => {
  return (
    <div>
      {props.data.message}
      <div>
        <Link to="/about">About</Link>
      </div>
    </div>
  );
};

export default Home;
