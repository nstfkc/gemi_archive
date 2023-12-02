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
  onSuccess?: (data: unknown) => void;
}

export const Form = (props: PropsWithChildren<FormProps>) => {
  const { children, action, method, onSuccess = () => {} } = props;
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({} as Record<string, string[]>);

  function formAction(formData: FormData) {
    setIsLoading(true);
    fetch(`/api${action}`, {
      method: method ?? "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        if (result.success) {
          setErrors({});
          formRef.current?.reset();
          onSuccess(result.data);
        } else {
          const issues = result.error?.issues ?? {};
          let errors = {};
          for (const issue of issues) {
            errors[issue.path[0]] = issue.message;
          }
          console.log({ errors });
          setErrors(errors);
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
  const { label, name, children, ...rest } = props;

  const { errors } = useContext(FormContext);
  const { components } = useContext(FormConfigContext);
  const Component = components.field ?? "div";
  const errorMessage = errors[name];
  return (
    <Component {...rest} name={name} label={label}>
      {children}
      {errorMessage && (
        <div className="text-sm text-red-400">{errorMessage}</div>
      )}
    </Component>
  );
};
