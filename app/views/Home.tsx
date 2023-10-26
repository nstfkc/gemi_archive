import { Link } from "@/lib/client/router";

type HomeData = {
  message: string;
};

const Home = () => {
  return (
    <div>
      Home Page
      <div>
        <Link to="/about">About</Link>
      </div>
    </div>
  );
};

export default Home;
