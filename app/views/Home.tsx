import { Link } from "@/lib/client/router";
import { lazy } from "react";

interface HomeData {
  message: string;
}

const TestX = lazy(() =>
  import("./components/Test").then((m) => ({ default: m.Test })),
);

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
      <div>
        <TestX />
      </div>
    </div>
  );
};

export default Home;
