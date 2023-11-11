import type { Routes } from "./types";

import {
  ComponentProps,
  ComponentType,
  LazyExoticComponent,
  PropsWithChildren,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createBrowserHistory, History, Location } from "history";

interface RouteDefinition {
  loader: (() => Promise<unknown>) | null;
  path: string;
  layout: string[];
  level: number;
}

interface RouteProps {
  level: number;
  Component: LazyExoticComponent<ComponentType<any>>;
  path: string;
}

export const Route = (props: PropsWithChildren<RouteProps>) => {
  const { Component, level } = props;
  const { location, routeDataRef } = useContext(RouterContext);

  const shouldRender = useCallback(
    (location: Location) =>
      level === 0
        ? location.pathname === props.path
        : location.pathname.startsWith(props.path),
    [level, props.path],
  );

  const [render, setRender] = useState(shouldRender(location));

  useEffect(() => {
    console.log("mounted");
    history.listen((update) => {
      setRender(shouldRender(update.location));
    });
    return () => {
      console.log("unmounted");
    };
  }, [shouldRender]);

  if (!render) {
    return null;
  }

  return (
    <Component data={routeDataRef.current?.get(props.path)}>
      {props.children}
    </Component>
  );
};

interface LayoutProps {
  Component: LazyExoticComponent<ComponentType<any>>;
  path: string;
  layoutName: string;
}

export const Layout = (props: PropsWithChildren<LayoutProps>) => {
  const { Component } = props;
  const { location, routes, layoutDataRef } = useContext(RouterContext);

  const currentRoute = routes.find((route) => route.path === location.pathname);

  if (currentRoute?.layout.includes(props.layoutName)) {
    const data = layoutDataRef.current?.get(props.layoutName);

    return <Component data={data}>{props.children}</Component>;
  }

  return null;
};

interface RouterContextValue {
  location: Location;
  history: History;
  routes: RouteDefinition[];
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
  routes: RouteDefinition[];
  initialRouteData: Readonly<any>;
  initialLayoutData: Readonly<any>;
}

export const RouterProvider = (
  props: PropsWithChildren<RouterProviderProps>,
) => {
  const { initialPath, routes } = props;
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
      value={{ location, history, routes, routeDataRef, layoutDataRef }}
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

  const { history, routes, routeDataRef } = useContext(RouterContext);
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
        let loader = () => Promise.resolve({} as unknown);
        const route = routes.find((route) => route.path === href);
        if (route && typeof route.loader === "function") {
          loader = route.loader;
        }
        loader()
          .then((data) => {
            routeDataRef.current?.set(route?.path!, data as any);
            history.push(href);
          })
          .catch(console.log);
      }}
      {...rest}
    >
      {props.children}
    </a>
  );
};
