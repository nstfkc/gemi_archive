import type { Routes } from "./types";

import {
  ComponentProps,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { createBrowserHistory, History, Location, To } from "history";

interface RouterContextValue {
  location: Location;
  history: History;
}
const RouterContext = createContext({} as RouterContextValue);

let history: History;

if (!import.meta.env.SSR) {
  history = createBrowserHistory();
}

interface RouterProviderProps {
  initialPath: string;
}

export const RouterProvider = (
  props: PropsWithChildren<RouterProviderProps>,
) => {
  const { children, initialPath } = props;
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
    <RouterContext.Provider value={{ location, history }}>
      {children}
    </RouterContext.Provider>
  );
};

interface LinkProps extends ComponentProps<"a"> {
  to: keyof Routes;
}

export const Link = (props: LinkProps) => {
  const { history } = useContext(RouterContext);
  return (
    <a
      href={props.to.toString()}
      onClick={(e) => {
        e.preventDefault();
        history.push(props.to);
      }}
    >
      {props.children}
    </a>
  );
};

interface RouteProps {
  Component: <T>(props: T) => JSX.Element;
  path: string;
}

export const Route = (props: RouteProps) => {
  const { Component } = props;
  const { location } = useContext(RouterContext);
  if (location.pathname !== props.path) {
    return null;
  }
  return <Component />;
};
