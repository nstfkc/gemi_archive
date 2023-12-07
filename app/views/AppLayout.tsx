import { Form } from "@/lib/client/form";
import { useNavigate } from "@/lib/client/router";
import { Button, Container, Flex, Text } from "@mantine/core";
import { PropsWithChildren } from "react";

const Logout = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  return (
    <Form onSuccess={() => navigate("/")} action="/auth/sign-out">
      {children}
    </Form>
  );
};

const AppLayout = ({ children, data }: PropsWithChildren) => {
  const { user } = data;
  return (
    <Container>
      <Flex justify="space-between">
        <img
          src="http://localhost:5173/gemi-logo.png"
          style={{ width: "44px" }}
          alt=""
        />
        <Flex gap="md" align="center">
          <Text fz="sm">
            Logged in as <br />
            <Text component="span" fz="sm" fw="bold">
              {user.email}
            </Text>
          </Text>
          <Logout>
            <Button type="submit" variant="subtle">
              Logout
            </Button>
          </Logout>
        </Flex>
      </Flex>
      <div>{children}</div>
    </Container>
  );
};

export default AppLayout;
