import { ComponentProps } from "react";

interface ButtonProps extends ComponentProps<"button"> {}

export const Button = (props: ButtonProps) => {
  return (
    <button
      {...props}
      className="disabled:opacity-50 bg-slate-600 rounded-md shadow-md text-white px-4 py-2 border-[1px] border-slate-500 text-sm font-semibold tracking-wider"
    />
  );
};
