import { Link } from "@/lib/client/router";

interface HomeData {
  message: string;
}

const Home = (props: { data: HomeData }) => {
  return (
    <div>
      {props.data.message}
      <div>Home View</div>
      <div className="bg-green-100">
        <Link href="/about" className="font-bold">
          About
        </Link>
      </div>
      <div>
        <Link href="/app/dashboard">Dashboard</Link>
      </div>
    </div>
  );
};

export default Home;
