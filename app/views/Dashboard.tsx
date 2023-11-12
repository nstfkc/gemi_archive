import { Link } from "@/lib/client/router";

interface DashboardData {
  message: string;
}

const Dashboard = () => {
  return (
    <div className="p-4 border-2">
      <div>
        <div className="text-red-400">Dashboard View</div>
      </div>
      <div>
        <Link href="/">Home Link</Link>
      </div>
    </div>
  );
};

export default Dashboard;
