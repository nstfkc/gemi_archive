import { Form, SubmitButton, Field } from "@/lib/client/form";
import { Input } from "../components/ui/Input";
import { Link, useNavigate } from "@/lib/client/router";

const LoginForm = () => {
  const navigate = useNavigate();
  return (
    <Form action="/auth/sign-in" onSuccess={() => navigate("/app/dashboard")}>
      <div className="flex flex-col gap-2">
        <Field name="email" label="Email">
          <Input type="email" name="email" />
        </Field>
        <Field name="password" label="Password">
          <Input type="password" name="password" />
        </Field>
        <div className="fec py-2">
          <SubmitButton>Login</SubmitButton>
        </div>
        <div className="ff">
          <span>Don&apos;t have an account?</span>
          <Link href="/auth/sign-up" className="font-semibold">
            Sign up
          </Link>
        </div>
      </div>
    </Form>
  );
};

const Login = () => {
  return (
    <div className="fc min-h-screen">
      <div className="grow max-w-xs">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
