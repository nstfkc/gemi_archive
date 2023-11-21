import {
  ComponentProps,
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import { FormConfigContext } from "./FormConfig";

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
  const formRef = useRef<HTMLFormElement>(null);
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
          formRef.current?.reset();
        }
      })
      .then(() => {
        setIsLoading(false);
      });
  }

  return (
    <FormContext.Provider value={{ isLoading, errors }}>
      <form ref={formRef} action={formAction as any}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

interface SubmitButtonProps extends ComponentProps<"button"> {}

export const SubmitButton = (props: SubmitButtonProps) => {
  const { isLoading } = useContext(FormContext);
  const { components } = useContext(FormConfigContext);
  const Button = components.primaryButton ?? "button";
  return <Button {...props} type="submit" disabled={isLoading} />;
};

export const Field = (
  props: PropsWithChildren<{ name: string; label: string }>,
) => {
  const { label, name, ...rest } = props;
  const { components } = useContext(FormConfigContext);
  const Field = components.field ?? "div";
  return <Field {...rest} name={name} label={label} />;
};
