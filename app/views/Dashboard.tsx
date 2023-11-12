import { Link, Outlet } from "@/lib/client/router";

interface DashboardData {
  message: string;
}

const Dashboard = () => {
  return (
    <div>
      <div>
        <div className="text-red-400">Dashboard</div>
      </div>
      <div>
        <Link href="/">Home Route</Link>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
