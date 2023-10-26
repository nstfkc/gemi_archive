import type { Routes } from "./types";

import {
  ComponentProps,
  RefObject,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createBrowserHistory, History, Location } from "history";

type RouteDefinition = {
  Component: <T>(props: T) => JSX.Element;
  loader: () => Promise<unknown>;
  path: string;
};

interface RouteProps {
  Component: <T>(props: { data: T }) => JSX.Element;
  path: string;
}

export const Route = (props: RouteProps) => {
  const { Component } = props;
  const { location, routeDataRef } = useContext(RouterContext);
  if (location.pathname !== props.path) {
    return null;
  }
  return <Component data={routeDataRef.current?.get(props.path)} />;
};

interface RouterContextValue {
  location: Location;
  history: History;
  routes: RouteDefinition[];
  routeDataRef: RefObject<Map<string, Readonly<any>>>;
}
const RouterContext = createContext({} as RouterContextValue);

let history: History;

if (!import.meta.env.SSR) {
  history = createBrowserHistory();
}

interface RouterProviderProps {
  initialPath: string;
  routes: RouteDefinition[];
  initialRouteData: Readonly<any>;
}

export const RouterProvider = (props: RouterProviderProps) => {
  const { initialPath, routes } = props;
  const routeDataRef = useRef(
    (() => {
      const map = new Map<string, Readonly<any>>();
      map.set(initialPath, props.initialRouteData);
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
    <RouterContext.Provider value={{ location, history, routes, routeDataRef }}>
      {routes.map(({ Component, path }) => (
        <Route path={path} Component={Component} key={path} />
      ))}
    </RouterContext.Provider>
  );
};

interface LinkProps extends ComponentProps<"a"> {
  to: keyof Routes;
}

export const Link = (props: LinkProps) => {
  const { history, routes, routeDataRef } = useContext(RouterContext);
  return (
    <a
      href={props.to}
      onClick={(e) => {
        e.preventDefault();
        let loader = () => Promise.resolve({} as unknown);
        const route = routes.find((route) => route.path === props.to);
        if (route && typeof route.loader === "function") {
          loader = route.loader;
        }
        loader().then((data) => {
          routeDataRef.current?.set(route?.path!, data as any);
          history.push(props.to);
        });
      }}
    >
      {props.children}
    </a>
  );
};
