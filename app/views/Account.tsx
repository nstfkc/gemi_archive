import { Link } from "@/lib/client/router";

interface AccountData {
  message: string;
}

const Account = (props: { data: AccountData }) => {
  return (
    <div>
      <div className="text-red-400">{props.data.message}</div>
      <div>
        <Link href="/">Home Route</Link>
      </div>
    </div>
  );
};

export default Account;
