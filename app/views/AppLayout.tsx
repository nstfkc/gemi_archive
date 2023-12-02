import { Form } from "@/lib/client/form";
import { useNavigate } from "@/lib/client/router";
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
    <div>
      <div>
        <Logout>
          <button>Logout</button>
        </Logout>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default AppLayout;
