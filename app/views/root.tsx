import { PropsWithChildren, StrictMode } from "react";
import {
  Box,
  useMantineTheme,
  MantineProvider,
  createTheme,
} from "@mantine/core";

import "@mantine/core/styles.css";
import "./styles/global.css";

const Wrapper = (props: PropsWithChildren) => {
  const theme = useMantineTheme();
  return (
    <Box mih="100vh" miw="100vw" bg={theme.colors.gray[1]}>
      {props.children}
    </Box>
  );
};

const theme = createTheme({
  primaryColor: "dark",
  defaultRadius: "md",
});

export const Root = (props: PropsWithChildren) => {
  return (
    <StrictMode>
      <MantineProvider theme={theme}>
        <main className="">
          <Wrapper>{props.children}</Wrapper>
        </main>
      </MantineProvider>
    </StrictMode>
  );
};
