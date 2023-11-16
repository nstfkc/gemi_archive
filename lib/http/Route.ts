import { Context, Hono } from "hono";
import { Controller } from "./Controller";
import { render, renderLayout } from "./render";
import React from "react";
import { CreateViewRoutes } from "./createViewRoutes";

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
    handler?: [{ new (): T }, K],
  ): ApiRoute<UnwrapPromise<Data>> => {
    return {
      kind: "api",
      handler: (app, config) => {
        const { path, parentPath } = config;
        app.on(
          [method],
          `${parentPath}${path}`.replace("//", "/"),
          async (ctx) => {
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
          },
        );
      },
    };
  };

interface Middleware {}

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
  ): ViewRoute<UnwrapPromise<Data>> => {
    return {
      kind: "view",
      viewPath,
      hasLoader: !!handler,
      handler: (app: Hono, config: ViewRouteConfig) => {
        const { path, routeManifest, template, layoutGetter, parentPath } =
          config;
        app.get(path, async (ctx) => {
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
    const { middlewares: _, routes, layout } = params;

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

        const group = new Hono();
        createViewRoutes(
          group,
          [parentPath, path].join("").replace("//", "/"),
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

  static get = createApiHandler(RouteMethod.GET);
  static post = createApiHandler(RouteMethod.POST);
  static patch = createApiHandler(RouteMethod.PATCH);
  static put = createApiHandler(RouteMethod.PUT);
  static delete = createApiHandler(RouteMethod.DELETE);

  static middleware = () => {
    return Route;
  };
  // static group = () => {};
}
