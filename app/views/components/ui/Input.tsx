import { ComponentProps } from "react";

export const Input = (props: ComponentProps<"input">) => {
  return (
    <input
      className="rounded-md px-2 py-2 outline-slate-400 ring-offset-4"
      {...props}
    />
  );
};
