import { useContext } from "react";
import { RouterContext } from "./RouterContext";

export function useNavigate() {
  const { routeMatcher, routes, routeDataRef, layoutDataRef, history } =
    useContext(RouterContext);
  function navigate(href: string) {
    const { match } = routeMatcher(href.split("?")[0]);
    let loader = (_: any) => Promise.resolve({} as unknown);
    const route = routes.find((route) => route.path === match);
    if (route && typeof route.loader === "function") {
      loader = route.loader;
    }
    loader(match)
      .then((data) => {
        if (data.success === false) {
          if (data.error.name === "AuthenticationError") {
            // TODO: get redirect from config
            navigate(`/auth/sign-in?callbackUrl=${href}`);
          }
        } else {
          const { layoutData, ...rest } = data as any;
          routeDataRef.current?.set(route?.path!, rest as any);
          if (layoutData) {
            const [key, value] = Object.entries(layoutData)?.[0] ?? [];
            layoutDataRef.current?.set(key, value);
          }
          history.push(href);
        }
      })
      .catch(console.log);
  }

  return navigate;
}
