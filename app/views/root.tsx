import { PropsWithChildren, StrictMode } from "react";
import { MantineProvider, createTheme } from "@mantine/core";

import "@mantine/core/styles.css";

const theme = createTheme({
  primaryColor: "dark",
});

export const Root = (props: PropsWithChildren) => {
  return (
    <StrictMode>
      <MantineProvider theme={theme}>
        <main className="">{props.children}</main>
      </MantineProvider>
    </StrictMode>
  );
};
