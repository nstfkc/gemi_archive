import { Link } from "@/lib/client/router";

interface HomeData {
  message: string;
}

const Home = (props: { data: HomeData }) => {
  return (
    <div>
      {props.data.message}!!!
      <div>
        <Link to="/about">About 2</Link>
      </div>
      <div>
        <Link to="/auth/login">Login</Link>
      </div>
    </div>
  );
};

export default Home;
