import { Context, Hono } from "hono";
import { Controller } from "./Controller";
import { render, renderLayout } from "./render";
import React from "react";
import {
  CreateApiRoutes,
  CreateViewRoutes,
  createApiRoutes,
} from "./createViewRoutes";

// type MaybePromise<T> = Promise<T> | T;

type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;

enum RouteMethod {
  GET = "get",
  POST = "post",
  PATCH = "patch",
  PUT = "put",
  DELETE = "delete",
}

type ClassMethodNames<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any[]) => unknown ? K : never;
}[keyof T];

const createApiHandler =
  (method: RouteMethod) =>
  <
    T extends Controller,
    K extends ClassMethodNames<T>,
    Data = InstanceType<{ new (): T }>[K] extends (ctx: Context) => infer R
      ? R
      : never,
  >(
    handler: [{ new (): T }, K],
    config: { middlewares: Middleware[] } = { middlewares: [] },
  ): ApiRoute<UnwrapPromise<Data>> => {
    const { middlewares } = config;
    return {
      kind: "api",
      handler: (app, config) => {
        const { path, parentPath } = config;
        app[method](`${parentPath}${path}`, ...middlewares, async (ctx) => {
          let dataPromise = Promise.resolve({} as Data);
          if (handler) {
            const [Controller, methodName] = handler;
            const instance = new Controller();
            const method = instance[methodName];
            if (typeof method === "function") {
              dataPromise = method.call(instance, ctx) as Promise<
                Awaited<Data>
              >;
            }
          }
          const [data] = await Promise.all([dataPromise]);

          return ctx.json({ data });
        });
      },
    };
  };

type Middleware = (ctx: Context, next: () => Promise<void>) => Promise<void>;

export type LayoutGetter = (
  ctx: Context,
  parentLayoutGetter?: LayoutGetter,
) => Promise<{
  wrapper: (children: JSX.Element) => JSX.Element;
  data: unknown;
}>;

interface ViewRouteConfig {
  path: string;
  parentPath: string;
  template: string;
  routeManifest: Record<string, any>;
  createViewRoutes: CreateViewRoutes;
  layoutGetter: LayoutGetter;
}

interface ApiRouteConfig {
  path: string;
  parentPath: string;
  createApiRoutes: CreateApiRoutes;
}

export interface ViewRoute<_Data> {
  kind: "view";
  hasLoader: boolean;
  handler: (app: Hono, config: ViewRouteConfig) => void;
  viewPath: string;
}

export interface ApiRoute<_Data> {
  kind: "api";
  handler: (app: Hono, config: { path: string; parentPath: string }) => void;
}

export interface ApiRouteGroup<T> {
  kind: "group";
  routes: T;
  handler: (app: Hono, config: any) => void;
}

export interface ViewRouteGroup<T> {
  kind: "group";
  layoutPath?: string;
  routes: T;
  handler: (app: Hono, config: any) => void;
}

export interface ViewLayout<T> {
  viewPath: string;
  hasLoader: boolean;
  handler: (layoutGetter: LayoutGetter) => (ctx: Context) => Promise<{
    wrapper: (children: React.JSX.Element) => React.JSX.Element;
    data: { [key: string]: T };
  }>;
}

export class Route {
  static view = <
    T extends Controller,
    K extends ClassMethodNames<T>,
    Data = InstanceType<{ new (): T }>[K] extends (ctx: Context) => infer R
      ? R
      : never,
  >(
    viewPath: string,
    handler?: [{ new (): T }, K],
    params?: { middlewares?: Middleware[] },
  ): ViewRoute<UnwrapPromise<Data>> => {
    const { middlewares = [] } = params ?? {};
    return {
      kind: "view",
      viewPath,
      hasLoader: !!handler,
      handler: (app: Hono, config: ViewRouteConfig) => {
        const { path, routeManifest, template, layoutGetter, parentPath } =
          config;
        app.get(path, ...middlewares, async (ctx) => {
          let dataPromise = Promise.resolve({} as Data);
          if (handler) {
            const [Controller, methodName] = handler;
            const instance = new Controller();
            const method = instance[methodName];
            if (typeof method === "function") {
              dataPromise = method.call(instance, ctx) as Promise<
                Awaited<Data>
              >;
            }
          }
          const [data, layout] = await Promise.all([
            dataPromise,
            layoutGetter(ctx),
          ]);

          if (ctx.req.query("__json") === "true") {
            return ctx.json(data);
          }
          const html = render({
            viewPath,
            data,
            path: [parentPath, path].join("").replace("//", "/"),
            params: ctx.req.param() as Record<string, string>,
            url: ctx.req.path,
            template,
            routeManifest,
            layout: layout.wrapper,
            layoutData: layout.data,
          });

          return ctx.html(html);
        });
      },
    };
  };

  static layout = <
    T extends Controller,
    K extends ClassMethodNames<T>,
    Data = InstanceType<{ new (): T }>[K] extends (ctx: Context) => infer R
      ? R
      : never,
  >(
    viewPath: string,
    handler?: [{ new (): T }, K],
  ): ViewLayout<UnwrapPromise<Data>> => {
    return {
      viewPath,
      hasLoader: !!handler,
      handler: (parentLayoutGetter: LayoutGetter) => {
        return async (ctx: Context) => {
          let dataPromise = Promise.resolve({} as Data);
          if (handler) {
            const [Controller, methodName] = handler;
            const instance = new Controller();
            const method = instance[methodName];
            if (typeof method === "function") {
              dataPromise = method.call(instance, ctx) as Promise<
                Awaited<Data>
              >;
            }
          }
          const [data, parentLayout] = await Promise.all([
            dataPromise,
            parentLayoutGetter(ctx),
          ]);
          return renderLayout(
            viewPath,
            { [viewPath]: data, ...(parentLayout.data ?? {}) },
            parentLayout.wrapper,
          );
        };
      },
    };
  };

  static viewGroup = <
    T,
    R extends string,
    U = Record<R, ViewRoute<T>>,
  >(params: {
    routes: U;
    layout?: ViewLayout<unknown>;
    middlewares?: Middleware[];
  }): ViewRouteGroup<U> => {
    const { middlewares = [], routes, layout } = params;

    return {
      kind: "group",
      layoutPath: layout?.viewPath,
      routes,
      handler: (app: Hono, config: ViewRouteConfig) => {
        const {
          createViewRoutes,
          layoutGetter,
          path,
          routeManifest,
          template,
          parentPath,
        } = config;
        const groupPath = [parentPath, path].join("").replace("//", "/");
        const group = new Hono();
        group.use(groupPath, ...middlewares);
        createViewRoutes(
          group,
          groupPath,
          {
            routeManifest,
            template,
            layoutGetter: layout?.handler(layoutGetter) ?? layoutGetter,
          },
          routes as any,
        );
        app.route(path, group);
      },
    };
  };

  static apiGroup = <T, R extends string, U = Record<R, ApiRoute<T>>>(params: {
    routes: U;
    middlewares?: Middleware[];
  }): ApiRouteGroup<U> => {
    const { middlewares = [], routes } = params;

    return {
      kind: "group",
      routes,
      handler: (app: Hono, config: ApiRouteConfig) => {
        const { path, parentPath, createApiRoutes } = config;
        const group = new Hono();
        group.use(`${path}/*`, ...middlewares);
        createApiRoutes(group, path, routes as any);
        app.route(parentPath, group);
      },
    };
  };

  static get = createApiHandler(RouteMethod.GET);
  static post = createApiHandler(RouteMethod.POST);
  static patch = createApiHandler(RouteMethod.PATCH);
  static put = createApiHandler(RouteMethod.PUT);
  static delete = createApiHandler(RouteMethod.DELETE);
}
