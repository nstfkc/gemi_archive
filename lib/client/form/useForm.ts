import { useContext } from "react";
import { FormContext } from "./Form";

export function useForm() {
  const { errors, isLoading } = useContext(FormContext);

  return {
    errors,
    isLoading,
  };
}
