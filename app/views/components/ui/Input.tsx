import { ComponentProps } from "react";

interface InputProps extends ComponentProps<"input"> {}

export const Input = (props: InputProps) => {
  return (
    <input
      className="bg-slate-100 rounded-md shadow-md px-2 py-2 outline-slate-400 ring-offset-4"
      {...props}
    />
  );
};
