import { Link } from "@/lib/client/router";

interface HomeData {
  message: string;
}

const Home = (props: { data: HomeData }) => {
  return (
    <div>
      {props.data.message}!!!
      <div className="bg-red-100">
        <Link href="/about" className="font-bold">
          About
        </Link>
      </div>
      <div>
        <Link href="/auth/login">Login</Link>
      </div>
    </div>
  );
};

export default Home;
