import { Link } from "@/lib/client/router";
import { Form } from "@/lib/client/form";

const LoginForm = () => {
  return (
    <Form action="/auth/login">
      <div className="flex flex-col gap-2 bg-red-100">
        <div>
          <input className="bg-slate-100 shadow-md" type="email" name="email" />
        </div>
        <div>
          <input
            className="bg-slate-100 shadow-md"
            type="password"
            name="password"
          />
        </div>
        <div>
          <Form.Button className="bg-black px-4 py-2 rounded-lg shadow-md text-white disabled:opacity-50">
            Login
          </Form.Button>
        </div>
      </div>
    </Form>
  );
};

const Login = () => {
  return (
    <div>
      <div>Login!</div>
      <div>
        <LoginForm />
      </div>
      <div>
        <Link href="/">Home</Link>
      </div>
    </div>
  );
};

export default Login;
