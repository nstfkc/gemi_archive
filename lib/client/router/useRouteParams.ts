import { useContext } from "react";
import { RouterContext } from "./RouterContext";

export function useRouteParams() {
  const { routerState } = useContext(RouterContext);
  return routerState?.params ?? {};
}
