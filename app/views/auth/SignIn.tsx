import { Form, useForm } from "@/lib/client/form";
import { TextInput } from "../components/ui/Form/TextInput";
import { Link, useNavigate } from "@/lib/client/router";
import { Button, Flex, Container } from "@mantine/core";

const SubmitButton = () => {
  const { isLoading } = useForm();
  return (
    <Button type="submit" disabled={isLoading}>
      Submit
    </Button>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  return (
    <Form action="/auth/sign-in" onSuccess={() => navigate("/app/dashboard")}>
      <Flex suppressHydrationWarning={true} gap="4" direction="column">
        <TextInput label="Email" name="email" />
        <TextInput label="Password" name="password" type="password" />
        <Flex justify="end">
          <SubmitButton />
        </Flex>
        <div className="ff">
          <span>Don&apos;t have an account?</span>
          <Link href="/auth/sign-up" className="font-semibold">
            Sign up
          </Link>
        </div>
      </Flex>
    </Form>
  );
};

const Login = () => {
  return (
    <div className="fc min-h-screen">
      <div className="grow max-w-xs">
        <Container size="xs">
          <LoginForm />
        </Container>
      </div>
    </div>
  );
};

export default Login;
