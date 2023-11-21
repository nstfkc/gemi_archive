import { ComponentProps, PropsWithChildren } from "react";

interface FieldProps extends ComponentProps<"div"> {
  name: string;
  label: string;
}

export const Field = (props: PropsWithChildren<FieldProps>) => {
  const { label, name, children, ...rest } = props;
  return (
    <div {...rest} className="flex flex-col gap-0">
      <label className="font-semibold text-sm" htmlFor={name}>
        {label}
      </label>
      {children}
    </div>
  );
};
