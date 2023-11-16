import { Link } from "@/lib/client/router";

const LoginForm = () => {
  const handleLogin = () => {
    fetch("/api/auth/login", {
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

const Login = () => {
  return (
    <div>
      <div>Login!</div>
      <LoginForm />
      <div>
        <Link href="/">Home</Link>
      </div>
    </div>
  );
};

export default Login;
