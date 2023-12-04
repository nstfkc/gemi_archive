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

const SubmitButton = () => {
  const { isLoading } = useForm();
  return (
    <Button radius="xl" size="md" type="submit" disabled={isLoading}>
      Submit
    </Button>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  return (
    <Form action="/auth/sign-in" onSuccess={() => navigate("/app/dashboard")}>
      <Flex gap={8} direction="column">
        <TextInput autoFocus label="Email" name="email" />
        <TextInput label="Password" name="password" type="password" />
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
