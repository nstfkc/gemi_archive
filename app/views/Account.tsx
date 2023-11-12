import { Link } from "@/lib/client/router";

interface AccountData {
  name: string;
}

const Account = (props: { data: AccountData }) => {
  return (
    <div>
      <div className="text-red-400">{props.data.name}</div>
      <div>
        <Link href="/">Home Link</Link>
      </div>
    </div>
  );
};

export default Account;
