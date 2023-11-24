import { Form, SubmitButton, Field } from "@/lib/client/form";
import { Input } from "../components/ui/Input";
import { Link } from "@/lib/client/router";
import { Logo } from "../components/Logo";

const SignUpForm = () => {
  return (
    <Form action="/auth/sign-up">
      <div className="flex flex-col gap-4">
        <Field label="Name" name="name">
          <Input name="name" />
        </Field>
        <Field name="email" label="Email">
          <Input type="email" name="email" />
        </Field>
        <Field name="password" label="Password">
          <Input type="password" name="password" />
        </Field>
        <div className="fec py-2">
          <SubmitButton>Sign Up</SubmitButton>
        </div>
        <div className="ff">
          <span>Do you have an account?</span>
          <Link href="/auth/sign-in" className="font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </Form>
  );
};

const SignUp = () => {
  return (
    <div className="fc min-h-screen">
      <div className="grow max-w-sm">
        <Logo />
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
