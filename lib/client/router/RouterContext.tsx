import type { Routes } from "./types";

import {
  ComponentProps,
  ComponentType,
  LazyExoticComponent,
  PropsWithChildren,
  RefObject,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createBrowserHistory, History, Location } from "history";

interface RouteDefinition {
  Component: LazyExoticComponent<ComponentType<any>>;
  loader: (() => Promise<unknown>) | null;
  path: string;
}

interface RouteProps {
  Component: LazyExoticComponent<ComponentType<any>>;
  path: string;
}

export const Route = (props: RouteProps) => {
  const { Component } = props;
  const { location, routeDataRef, history } = useContext(RouterContext);
  if (location.pathname !== props.path) {
    return null;
  }
  const data = routeDataRef.current?.get(props.path);
  if (data?.redirect) {
    history.push(data.redirect);
    return <></>;
  }
  return <Component data={routeDataRef.current?.get(props.path)} />;
};

interface LayoutProps {
  Component: LazyExoticComponent<ComponentType<any>>;
  path: string;
  layoutName: string;
}

export const Layout = (props: PropsWithChildren<LayoutProps>) => {
  const { Component } = props;
  const { location, layoutDataRef, history } = useContext(RouterContext);
  console.log(location.pathname, props.path);
  if (location.pathname !== props.path) {
    return null;
  }
  const data = layoutDataRef.current?.get(props.layoutName);
  if (data?.redirect) {
    history.push(data.redirect);
    return <></>;
  }
  return <Component data={data}>{props.children}</Component>;
};

interface RouterContextValue {
  location: Location;
  history: History;
  /* routes: RouteDefinition[]; */
  routeDataRef: RefObject<Map<string, Readonly<any>>>;
  layoutDataRef: RefObject<Map<string, Readonly<any>>>;
}
const RouterContext = createContext({} as RouterContextValue);

let history: History;

if (!import.meta.env.SSR) {
  history = createBrowserHistory();
}

interface RouterProviderProps {
  initialPath: string;
  /* routes: RouteDefinition[]; */
  initialRouteData: Readonly<any>;
  initialLayoutData: Readonly<any>;
}

export const RouterProvider = (
  props: PropsWithChildren<RouterProviderProps>,
) => {
  const { initialPath } = props;
  const routeDataRef = useRef(
    (() => {
      const map = new Map<string, Readonly<any>>();
      map.set(initialPath, props.initialRouteData);
      return map;
    })(),
  );

  const layoutDataRef = useRef(
    (() => {
      const map = new Map<string, Readonly<any>>();
      for (const [layoutName, data] of Object.entries(
        props.initialLayoutData,
      )) {
        map.set(layoutName, data);
      }
      return map;
    })(),
  );

  const [location, setLocation] = useState<Location>({
    hash: "",
    key: "",
    pathname: initialPath,
    search: "",
    state: {},
  });

  useEffect(() => {
    history.listen((update) => {
      setLocation({ ...update.location });
    });
  }, []);

  return (
    <RouterContext.Provider
      value={{ location, history, routeDataRef, layoutDataRef }}
    >
      {props.children}
    </RouterContext.Provider>
  );
};

interface LinkProps extends Omit<ComponentProps<"a">, "href"> {
  href: keyof Routes;
}

export const Link = (props: LinkProps) => {
  const { href, onClick = () => {}, ...rest } = props;

  return <a {...props} />;

  /* const { history, routes, routeDataRef } = useContext(RouterContext);
   * return (
   *   <a
   *     href={href}
   *     onClick={(e) => {
   *       e.preventDefault();
   *       onClick(e);
   *       let loader = () => Promise.resolve({} as unknown);
   *       const route = routes.find((route) => route.path === href);
   *       if (route && typeof route.loader === "function") {
   *         loader = route.loader;
   *       }
   *       loader()
   *         .then((data) => {
   *           if (data.redirect) {
   *             history.push(data.redirect);
   *           } else {
   *             routeDataRef.current?.set(route?.path!, data as any);
   *             history.push(href);
   *           }
   *         })
   *         .catch(console.log);
   *     }}
   *     {...rest}
   *   >
   *     {props.children}
   *   </a>
   * ); */
};
