import * as z from "zod";
import React from "react";
import { Context, Hono } from "hono";

import { middlewareAliases } from "@/app/http/kernel";

import { Controller } from "./Controller";
import { render, renderLayout } from "./render";
import { CreateApiRoutes, CreateViewRoutes } from "./createViewRoutes";
import { HttpRequest } from "./HttpRequest";
import { createRequest } from "./createRequest";
import { AuthenticationError } from "./errors/AuthenticationError";

function renderMiddlewares(middlewares: Middleware[] = []) {
  return middlewares.map((middleware) => {
    if (typeof middleware === "string") {
      return (ctx: Context, next: VoidFunction) => {
        const instance = new middlewareAliases[middleware]();
        return instance.handle(ctx, next);
      };
    }
    return middleware;
  });
}

type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;

enum RouteMethod {
  GET = "get",
  POST = "post",
  PATCH = "patch",
  PUT = "put",
  DELETE = "delete",
}

type ClassMethodNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => unknown ? K : never;
}[keyof T];

type ExtractBody<T extends HttpRequest> = ReturnType<T["getBody"]>;
type ExtractParams<T extends HttpRequest> = ReturnType<T["getParams"]>;
type ExtractQuery<T extends HttpRequest> = ReturnType<T["getQuery"]>;

type InferData<
  T extends Controller,
  K extends ClassMethodNames<T>,
> = InstanceType<{ new (): T }>[K] extends (...req: any[]) => infer R
  ? UnwrapPromise<R>
  : never;

type InferBody<
  T extends Controller,
  K extends ClassMethodNames<T>,
> = InstanceType<{ new (): T }>[K] extends (req: infer R) => unknown
  ? UnwrapPromise<ExtractBody<R extends HttpRequest ? R : never>>
  : never;

type InferRequest<
  T extends Controller,
  K extends ClassMethodNames<T>,
> = InstanceType<{ new (ctx: Context): T }>[K] extends (req: infer R) => unknown
  ? R extends HttpRequest
    ? R
    : never
  : never;
const createApiHandler =
  (method: RouteMethod) =>
  <
    T extends Controller,
    K extends ClassMethodNames<T>,
    Body = UnwrapPromise<ExtractBody<InferRequest<T, K>>>,
    Params = UnwrapPromise<ExtractParams<InferRequest<T, K>>>,
    Query = UnwrapPromise<ExtractQuery<InferRequest<T, K>>>,
    Data = InferData<T, K>,
  >(
    handler: [{ new (ctx: Context): T }, K],
    config: { middlewares: Middleware[] } = { middlewares: [] },
  ): ApiRoute<Body, Params, Query, Data> => {
    const { middlewares } = config;
    return {
      kind: "api",
      handler: (app, config) => {
        const { path, parentPath } = config;
        app[method](
          `${parentPath}${path}`,
          ...renderMiddlewares(middlewares),
          async (ctx) => {
            const contentTypeHeader = ctx.req.raw.headers.get("Content-Type");

            const unsupportedContentTypes = [
              "multipart/form-data",
              "application/x-www-form-urlencoded",
            ];

            for (const unsupportedContentType of unsupportedContentTypes) {
              if (contentTypeHeader?.startsWith(unsupportedContentType)) {
                return ctx.json({
                  success: false,
                  error: ` ${unsupportedContentType} is not supported`,
                });
              }
            }

            let dataPromise = Promise.resolve({} as Data);
            if (handler) {
              const [Controller, methodName] = handler;
              const instance = new Controller(ctx);
              const method = instance[methodName];
              if (typeof method === "function") {
                const req = createRequest(
                  ctx,
                  `${Controller.name}.${methodName}`,
                );

                dataPromise = method.call(instance, req) as Promise<
                  Awaited<Data>
                >;
              }
            }

            try {
              const [data] = await Promise.all([dataPromise]);
              return ctx.json({ data, success: true });
            } catch (err) {
              let error = {};
              if (err instanceof z.ZodError) {
                error = err;
                ctx.status(403);
              }

              if (err instanceof AuthenticationError) {
                ctx.status(401);
                error = { name: err.name, message: err.message };
              }

              return ctx.json({ success: false, error });
              // Do something
            }
          },
        );
      },
    };
  };

type Middleware =
  | ((ctx: Context, next: () => Promise<void>) => Promise<void>)
  | keyof typeof middlewareAliases;

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

export interface ApiRoute<Body, Params, Query, Data> {
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
    handler?: [{ new (ctx: Context): T }, K],
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

        app.get(path, ...renderMiddlewares(middlewares), async (ctx) => {
          let dataPromise = Promise.resolve({} as Data);
          let instance: T | undefined;
          if (handler) {
            const [Controller, methodName] = handler;
            instance = new Controller(ctx);
            const method = instance[methodName];
            if (typeof method === "function") {
              const request = createRequest(
                ctx,
                `${Controller.name}.${String(methodName)}`,
              );
              dataPromise = method.call(instance, request) as Promise<
                Awaited<Data>
              >;
            }
          }

          const [data, layout] = await Promise.all([
            dataPromise,
            layoutGetter(ctx),
          ]);

          if (ctx.req.query("__json") === "true") {
            return ctx.json({ ...data, layoutData: layout.data });
          }
          const html = render({
            viewPath,
            data,
            path: [parentPath, path].join("").replace("//", "/"),
            params: ctx.req.param() as Record<string, string>,
            url: ctx.req.url,
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
    handler?: [{ new (ctx: Context): T }, K],
  ): ViewLayout<UnwrapPromise<Data>> => {
    return {
      viewPath,
      hasLoader: !!handler,
      handler: (parentLayoutGetter: LayoutGetter) => {
        return async (ctx: Context) => {
          let dataPromise = Promise.resolve({} as Data);
          if (handler) {
            const [Controller, methodName] = handler;
            const instance = new Controller(ctx);
            const method = instance[methodName];
            if (typeof method === "function") {
              const request = createRequest(
                ctx,
                `${Controller.name}.${methodName}`,
              );
              dataPromise = method.call(instance, request) as Promise<
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
        app.use(`${path}/*`, ...renderMiddlewares(middlewares));
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

  static apiGroup = <
    T,
    K,
    R extends string,
    U = Record<R, ApiRoute<T, K>>,
  >(params: {
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
        group.use(`${path}/*`, ...renderMiddlewares(middlewares));
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
