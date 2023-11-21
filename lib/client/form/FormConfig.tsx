import { ComponentProps, PropsWithChildren, createContext } from "react";

const Button = (props: ComponentProps<"button">) => <button {...props} />;
const Input = (props: ComponentProps<"input">) => <input {...props} />;
const TextArea = (props: ComponentProps<"textarea">) => <textarea {...props} />;
const Field = ({
  children,
  name,
  label,
  ...props
}: ComponentProps<"div"> & { name: string; label: string }) => (
  <div {...props}>
    <label htmlFor={name}>{label}</label>
    {children}
  </div>
);

const formComponents = {
  primaryButton: Button,
  secondaryButton: Button,
  input: Input,
  numberInput: Input,
  textArea: TextArea,
  field: Field,
};

export const FormConfigContext = createContext({ components: formComponents });

interface FormConfigProps {
  components: Partial<typeof formComponents>;
}

export const FormConfig = (props: PropsWithChildren<FormConfigProps>) => {
  const { components } = props;
  return (
    <FormConfigContext.Provider
      value={{ components: { ...formComponents, ...components } }}
    >
      {props.children}
    </FormConfigContext.Provider>
  );
};
