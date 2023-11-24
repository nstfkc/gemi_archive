import { FormConfig } from "@/lib/client/form/FormConfig";
import { Button } from "./components/ui/Button";
import { Field } from "./components/ui/Field";

import { PropsWithChildren } from "react";

export const Root = (props: PropsWithChildren) => {
  return (
    <FormConfig components={{ primaryButton: Button, field: Field }}>
      <main className="">{props.children}</main>
    </FormConfig>
  );
};
