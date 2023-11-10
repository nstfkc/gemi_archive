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

interface ViewRouteDefinition<Data> {
  exec: (ctx: Context) => Promise<{ data: Data }>;
  hasLoader: boolean;
  method: RouteMethod.GET;
  viewPath: string;
}

interface ApiRouteDefinition<Data> {
  exec: (ctx: Context) => Promise<{ data: Data }>;
  method: RouteMethod;
}

type ClassMethodNames<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any[]) => unknown ? K : never;
}[keyof T];

type ViewRouteHandler = <
  T extends Controller,
  K extends ClassMethodNames<T>,
  Data = InstanceType<{ new (): T }>[K] extends (ctx: Context) => infer R
    ? UnwrapPromise<R>
    : never,
>(
  viewPath: string,
  controller?: [{ new (): T }, K],
) => ViewRouteDefinition<Data>;

type ApiRouteHandler = <
  T extends Controller,
  K extends ClassMethodNames<T>,
  Data = InstanceType<{ new (): T }>[K] extends (ctx: Context) => infer R
    ? UnwrapPromise<R>
    : never,
>(
  controller: [{ new (): T }, K] | (<Data>(ctx: Context) => Data),
) => ApiRouteDefinition<Data>;

const createApiHandler = (method: RouteMethod): ApiRouteHandler => {
  return (handler) => {
    return {
      exec: async (ctx) => {
        if (typeof handler === "function") {
          const data = await handler(ctx);
          return { data };
        }
        const [C, methodName] = handler;
        const controllerInstance = new C();
        let data = {};

        const method = controllerInstance[methodName];
        if (typeof method === "function") {
          // RouterContext.enterWith({ request: ctx.req, response: ctx.res });
          data = (await method(ctx)) as typeof data;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
        return { data } as any;
      },
      method,
    };
  };
};

interface ViewRouteConfig {
  path: string;
  template: string;
  routeViewMap: Record<string, string>;
  createViewRoutes: CreateViewRoutes;
  layoutGetter: (
    ctx: Context,
  ) => Promise<(children: JSX.Element) => JSX.Element>;
}

export interface ViewRoute<_Data> {
  kind: "view";
  hasLoader: boolean;
  handler: (app: Hono, config: ViewRouteConfig) => void;
  viewPath: string;
}

export interface ViewRouteGroup<T> {
  kind: "group";
  layoutPath: string;
  routes: T;
  handler: (app: Hono, config: any) => void;
}

export interface ViewLayout<_T> {
  viewPath: string;
  hasLoader: boolean;
  handler: (
    ctx: Context,
  ) => Promise<(children: React.JSX.Element) => React.JSX.Element>;
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
  ): ViewRoute<Data> => {
    return {
      kind: "view",
      viewPath,
      hasLoader: !!handler,
      handler: (app: Hono, config: ViewRouteConfig) => {
        app.get(config.path, async (ctx) => {
          const { path, routeViewMap, template, layoutGetter } = config;
          let data = {} as Data;
          if (handler) {
            const [Controller, methodName] = handler;
            const instance = new Controller();
            const method = instance[methodName];
            data = await method.call(instance, ctx);
          }
          const layout = await layoutGetter(ctx);
          if (ctx.req.query("__json") === "true") {
            return ctx.json(data);
          }
          const html = render({
            viewPath,
            data,
            path,
            template,
            routeViewMap,
            layout,
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
  ): ViewLayout<Data> => {
    return {
      viewPath,
      hasLoader: !!handler,
      handler: async (ctx: Context) => {
        let data = {} as Data;
        if (handler) {
          const [Controller, methodName] = handler;
          const instance = new Controller();
          const method = instance[methodName];
          data = await method.call(instance, ctx);
        }
        return renderLayout(viewPath, data);
      },
    };
  };

  static viewGroup = <T, R extends string, U = Record<R, ViewRoute<T>>>(
    layout: ViewLayout<any>,
    routes: U,
  ): ViewRouteGroup<U> => {
    return {
      kind: "group",
      layoutPath: layout.viewPath,
      routes,
      handler: (app: Hono, config: ViewRouteConfig) => {
        const { createViewRoutes, layoutGetter, path, routeViewMap, template } =
          config;

        const group = new Hono();
        createViewRoutes(
          group,
          {
            routeViewMap,
            template,
            layoutGetter: layout.handler,
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
