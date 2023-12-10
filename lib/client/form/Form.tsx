import {
  ComponentProps,
  PropsWithChildren,
  createContext,
  useRef,
  useState,
} from "react";

export const FormContext = createContext({
  isLoading: false,
  errors: {} as Record<string, string[]>,
});

interface FormProps extends Omit<ComponentProps<"form">, "action" | "method"> {
  action: string;
  method?: "POST" | "GET";
  onSuccess?: (data: unknown) => void;
}

export const Form = (props: PropsWithChildren<FormProps>) => {
  const {
    children,
    action,
    method,
    onSuccess = () => {},
    ...formProps
  } = props;
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
          setErrors(errors);
        }
      })
      .then(() => {
        setIsLoading(false);
      });
  }

  return (
    <FormContext.Provider value={{ isLoading, errors }}>
      <form ref={formRef} action={formAction as any} {...formProps}>
        {children}
      </form>
    </FormContext.Provider>
  );
};
