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
} from "@mantine/core";

import { useEffect, useState } from "react";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { Logo } from "../components/Logo";

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

const LoginForm = () => {
  const [success, setSuccess] = useState(false);
  const [showInput, setShowInput] = useState(false);

  if (success) {
    return <div>We sent you a magic link</div>;
  }
  return (
    <Form
      action="/auth/sign-in/passwordless"
      onSuccess={() => setSuccess(true)}
    >
      <Flex gap={4} direction="column">
        <Transition
          mounted={showInput}
          transition={{
            in: { height: "80px" },
            out: { height: 0 },
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
            duration={500}
            timingFunction="ease"
          >
            {(styles) => (
              <Box style={styles}>
                <Flex direction="column" align="center" justify="center">
                  <Logo />
                  <Text>Login to Gemi</Text>
                </Flex>
                <Box mt={16} />
                <Button
                  variant="filled"
                  component="a"
                  size="md"
                  href={props.data.googleSignInUrl}
                >
                  <Flex bg="dark" gap={8}>
                    <IconBrandGoogleFilled />
                    <Text fw={600}>Continue with Google</Text>
                  </Flex>
                </Button>
                <LoginForm />
              </Box>
            )}
          </Transition>
        </Box>
      </Center>
    </Container>
  );
};

export default SignIn;
