import { useContext } from "react";
import { RouterContext } from "./RouterContext";

export function useQueryParams() {
  const { routerState } = useContext(RouterContext);
  return routerState?.query ?? {};
}
