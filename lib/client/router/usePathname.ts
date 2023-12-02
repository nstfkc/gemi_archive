import { useContext } from "react";
import { RouterContext } from "./RouterContext";

export function usePathname() {
  const { routerState } = useContext(RouterContext);

  return routerState.match;
}
