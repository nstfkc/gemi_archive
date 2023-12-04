import { useForm } from "@/lib/client/form";

import {
  TextInput as MantineTextInput,
  TextInputProps as MantineTextInputProps,
} from "@mantine/core";

export const TextInput = (props: MantineTextInputProps) => {
  const { errors } = useForm();
  const id = `${props.name}-id`;

  return (
    <MantineTextInput
      {...props}
      id={id}
      labelProps={{ htmlFor: id }}
      error={errors[props?.name ?? ""]}
    />
  );
};
