import { Link } from "@/lib/client/router";

interface HomeData {
  message: string;
}

const Home = (props: { data: HomeData }) => {
  return (
    <div>
      {props.data.message}
      <div className="bg-green-100">
        <Link href="/about" className="font-bold">
          About
        </Link>
      </div>
      <div>
        <Link href="/auth/login">Login</Link>
        <Link href="/account">Account</Link>
      </div>
    </div>
  );
};

export default Home;
