import { Form, useForm } from "@/lib/client/form";
import { TextInput } from "../components/ui/Form/TextInput";
import {
  Box,
  Button,
  Center,
  Flex,
  Container,
  Text,
  ButtonProps,
  Divider,
  Transition,
  Title,
} from "@mantine/core";

import { useEffect, useState } from "react";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { Logo } from "../components/Logo";
import { useNavigate } from "@/lib/client/router";

const SubmitButton = () => {
  const { isLoading } = useForm();
  return (
    <Button
      fullWidth
      variant="outline"
      size="md"
      type="submit"
      disabled={isLoading}
    >
      Continue with email
    </Button>
  );
};

const ShowButton = (props: ButtonProps) => {
  return (
    <Button fullWidth variant="outline" type="button" size="md" {...props}>
      Continue with email
    </Button>
  );
};

interface LoginFormProps {
  googleSignInUrl: string;
}

const LoginForm = (props: LoginFormProps) => {
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [showCodeForm, setShowCodeForm] = useState(false);
  const navigate = useNavigate();

  if (success) {
    return (
      <Flex direction="column" gap="md" align="center" justify="center">
        <Logo />
        <Flex direction="column" align="center">
          <Title order={1}>Check your email</Title>
          <Text>We've sent a temporary link.</Text>
          <Text>Please check your inbox at {email}</Text>
        </Flex>
        <Transition mounted={showCodeForm}>
          {(styles) => {
            return (
              <Box style={styles}>
                <Form
                  id="code-form"
                  action="/auth/sign-in/with-token"
                  onSuccess={() => navigate("/app/dashboard")}
                >
                  {email && <input type="hidden" name="email" value={email} />}
                  <TextInput
                    placeholder="Enter your code..."
                    autoFocus
                    name="code"
                    required
                  />
                </Form>
              </Box>
            );
          }}
        </Transition>
        <Button
          form={showCodeForm ? "code-form" : ""}
          type={showCodeForm ? "submit" : "button"}
          onClick={() => setShowCodeForm(true)}
        >
          Enter code manually
        </Button>
        <Button
          variant="subtle"
          onClick={() => {
            setEmail(null);
            setShowInput(false);
            setSuccess(false);
          }}
        >
          Back to login
        </Button>
      </Flex>
    );
  }

  return (
    <div>
      <Flex direction="column" align="center" justify="center">
        <Logo />
        <Text>Login to Gemi</Text>
      </Flex>
      <Box mt={16} />
      <Button
        variant="filled"
        component="a"
        size="md"
        href={props.googleSignInUrl}
      >
        <Flex bg="dark" gap={8}>
          <IconBrandGoogleFilled />
          <Text fw={600}>Continue with Google</Text>
        </Flex>
      </Button>
      <Form
        action="/auth/sign-in/passwordless"
        onSuccess={(data: any) => {
          setEmail(data.email);
          setSuccess(true);
        }}
      >
        <Flex gap={4} direction="column">
          <Transition
            mounted={showInput}
            transition={{
              in: { height: "80px", opacity: 1 },
              out: { height: 0, opacity: 0 },
              transitionProperty: "all",
            }}
            duration={200}
          >
            {(styles) => (
              <Box style={styles}>
                <Divider my="lg" color="dark" />
                <TextInput
                  placeholder="Enter your email address..."
                  autoFocus
                  name="email"
                  required
                />
              </Box>
            )}
          </Transition>
          <Flex justify="end" pt={8} align="center">
            {showInput ? (
              <SubmitButton />
            ) : (
              <ShowButton onClick={() => setShowInput(true)} />
            )}
          </Flex>
        </Flex>
      </Form>
    </div>
  );
};

const SignIn = (props: { data: { googleSignInUrl: string } }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Container mih="100vh">
      <Center mih="100vh">
        <Box>
          <Transition
            mounted={mounted}
            transition="pop"
            duration={600}
            timingFunction="ease"
          >
            {(styles) => (
              <Box style={styles}>
                <LoginForm googleSignInUrl={props.data.googleSignInUrl} />
              </Box>
            )}
          </Transition>
        </Box>
      </Center>
    </Container>
  );
};

export default SignIn;
