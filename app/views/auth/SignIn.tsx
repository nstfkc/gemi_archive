import { Form, useForm } from "@/lib/client/form";
import { TextInput } from "../components/ui/Form/TextInput";
import { Link, useNavigate } from "@/lib/client/router";
import {
  Box,
  Anchor,
  Button,
  Center,
  Flex,
  Container,
  Text,
  Paper,
  useMantineTheme,
} from "@mantine/core";
import { useState } from "react";

const SubmitButton = () => {
  const { isLoading } = useForm();
  return (
    <Button radius="xl" size="md" type="submit" disabled={isLoading}>
      Submit
    </Button>
  );
};

const LoginForm = () => {
  const [success, setSuccess] = useState(false);

  if (success) {
    return <div>We sent you a magic link</div>;
  }
  return (
    <Form
      action="/auth/sign-in/passwordless"
      onSuccess={() => setSuccess(true)}
    >
      <Flex gap={8} direction="column">
        <TextInput
          defaultValue="enes@gemijs.dev"
          autoFocus
          label="Email"
          name="email"
        />
        <Flex justify="end" pt={8} align="center">
          <SubmitButton />
        </Flex>
      </Flex>
    </Form>
  );
};

const Login = () => {
  const theme = useMantineTheme();
  return (
    <Container mih="100vh">
      <Center mih="100vh">
        <Box>
          <Paper miw="360" shadow="sm" radius="lg" p={32}>
            <LoginForm />
          </Paper>
          <Flex gap={0} direction="column" align="center" px="xl" py={16}>
            <Text>Don&apos;t have an account?</Text>
            <Anchor fw="bold" component={Link} href="/auth/sign-up">
              Sign up
            </Anchor>
          </Flex>
        </Box>
      </Center>
    </Container>
  );
};

export default Login;
