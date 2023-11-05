import { Request, Response } from "express";
import { Controller } from "./Controller";
import { RouterContext } from "./RouterContext";

// type MaybePromise<T> = Promise<T> | T;

type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;

enum RouteMethod {
  GET = "get",
  POST = "post",
  PATCH = "patch",
  PUT = "put",
  DELETE = "delete",
}

export interface Ctx {
  req: Request;
  res: Response;
}

interface ViewRouteDefinition<Data> {
  exec: (ctx: Ctx) => Promise<{ data: Data }>;
  hasLoader: boolean;
  method: RouteMethod.GET;
  viewPath: string;
}

interface ApiRouteDefinition<Data> {
  exec: (ctx: Ctx) => Promise<{ data: Data }>;
  method: RouteMethod;
}

type ClassMethodNames<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any[]) => unknown ? K : never;
}[keyof T];

type ViewRouteHandler = <
  T extends Controller,
  K extends ClassMethodNames<T>,
  Data = InstanceType<{ new (): T }>[K] extends (ctx: Ctx) => infer R
    ? UnwrapPromise<R>
    : never,
>(
  viewPath: string,
  controller?: [{ new (): T }, K],
) => ViewRouteDefinition<Data>;

type ApiRouteHandler = <
  T extends Controller,
  K extends ClassMethodNames<T>,
  Data = InstanceType<{ new (): T }>[K] extends (ctx: Ctx) => infer R
    ? UnwrapPromise<R>
    : never,
>(
  controller: [{ new (): T }, K] | (<Data>(ctx: Ctx) => Data),
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
          RouterContext.enterWith({ request: ctx.req, response: ctx.res });
          data = (await method(ctx)) as typeof data;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
        return { data } as any;
      },
      method,
    };
  };
};

export class Route {
  static view: ViewRouteHandler = (viewPath, handler) => {
    return {
      exec: async (ctx: Ctx) => {
        if (!handler) {
          return { data: {} as never, viewPath };
        }
        const [Controller, methodName] = handler;
        const { req, res } = ctx;
        const instance = new Controller();
        const method = instance[methodName];

        let data = {};
        if (typeof method === "function") {
          data = (await method(ctx)) as typeof data;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        return { data: data as any };
      },
      method: RouteMethod.GET,
      hasLoader: !!handler,
      viewPath,
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
