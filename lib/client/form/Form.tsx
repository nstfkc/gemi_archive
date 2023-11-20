import {
  ComponentProps,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

const FormContext = createContext({
  isLoading: false,
  errors: {} as Record<string, string[]>,
});

interface FormProps {
  action: string;
  method?: "POST" | "GET";
}

export const Form = (props: PropsWithChildren<FormProps>) => {
  const { children, action, method } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({} as Record<string, string[]>);

  function formAction(formData: FormData) {
    setIsLoading(true);
    fetch(`/api${action}`, {
      method: method ?? "POST",
      body: formData,
    })
      .then((res) => {
        if (res.status === 200) {
          setErrors({});
        }
      })
      .then(() => {
        setIsLoading(false);
      });
  }

  return (
    <FormContext.Provider value={{ isLoading, errors }}>
      <form action={formAction as any}>{children}</form>
    </FormContext.Provider>
  );
};

interface SubmitButtonProps extends ComponentProps<"button"> {}

const SubmitButton = (props: SubmitButtonProps) => {
  const { isLoading } = useContext(FormContext);
  return <button {...props} type="submit" disabled={isLoading} />;
};

Form.Button = SubmitButton;
