import { useContext } from "react";
import { RouterContext } from "./RouterContext";

export function useURLSearchParams() {
  const { routerState } = useContext(RouterContext);
  return routerState?.urlSearchParams ?? {};
}
