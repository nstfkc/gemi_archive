import { Link } from "@/lib/client/router";
import { PropsWithChildren } from "react";

interface DashboardData {
  message: string;
}

const Dashboard = (props: PropsWithChildren) => {
  return (
    <div>
      <div>
        <div className="text-red-400">Dashboard</div>
      </div>
      <div>
        <Link href="/dashboard">Dashboard</Link>

        <Link href="/dashboard/account">Account</Link>
      </div>
      <div>{props.children}</div>
    </div>
  );
};

export default Dashboard;
