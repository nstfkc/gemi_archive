import { Link } from "@/lib/client/router";
import { PropsWithChildren } from "react";

const Dashboard = (props: PropsWithChildren) => {
  return (
    <div className="p-4 border-2">
      <div>
        <div className="text-red-400">Dashboard Layout</div>
      </div>
      <div className="font-bold flex gap-4 text-sm">
        <Link href="/dashboard">Dashboard</Link>

        <Link href="/dashboard/account">Account</Link>
      </div>
      <div className="p-2 border-2">{props.children}</div>
    </div>
  );
};

export default Dashboard;
