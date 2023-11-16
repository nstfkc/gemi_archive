import { Link } from "@/lib/client/router";
import { PropsWithChildren } from "react";

const Logout = () => {
  const handleLogin = () => {
    fetch("/api/auth/logout", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      });
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

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
      <Logout></Logout>
      <div className="p-2 border-2">{props.children}</div>
    </div>
  );
};

export default Dashboard;
