import { Request, Response } from "express";
import { Controller } from "./Controller";

interface RouterContext<T> {
  req: Request;
  res: Response;
  params: T;
}

type RouteKind = "VIEW" | "ENDPOINT";
enum RouteMethod {
  GET = "GET",
  POST = "POST",
}

interface RouteDefinition {
  kind: RouteKind;
}

interface ViewRouteDefinition extends RouteDefinition {
  kind: "VIEW";
  exec: (
    ctx: RouterContext<unknown[]>,
  ) => Promise<{ data: unknown; viewPath: string }>;
  viewPath: string;
  hasLoader: boolean;
  method: RouteMethod.GET;
  json: false;
}

type ViewRoute = <T extends Controller, K extends ClassMethodNames<T>>(
  viewPath: string,
  controller?: [{ new (): T }, K],
) => ViewRouteDefinition;

interface EndpointRouteDefinition extends RouteDefinition {
  kind: "ENDPOINT";
  exec: (ctx: RouterContext<unknown[]>) => Promise<{ data: unknown }>;
  method: RouteMethod.GET | RouteMethod.POST;
  json: true;
}

type EndpointRoute = <T extends Controller, K extends ClassMethodNames<T>>(
  Controller: { new (): T },
  methodName: K,
) => EndpointRouteDefinition;

type ClassMethodNames<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export const view: ViewRoute = (viewPath, controller): ViewRouteDefinition => {
  return {
    kind: "VIEW",
    exec: async (ctx: RouterContext<unknown[]>) => {
      if (!controller) {
        return { data: {}, viewPath };
      }
      const [Controller, methodName] = controller;
      const { req, res, params } = ctx;
      const instance = new Controller();
      const method = instance[methodName];

      let data = {};
      if (typeof method === "function") {
        data = (await method({ params })) as typeof data;
      }

      let result = {};
      if (typeof data === "function") {
        result = data(req, res) as typeof result;
        return { data: result, viewPath };
      }
      return { data, viewPath };
    },
    json: false,
    method: RouteMethod.GET,
    viewPath,
    hasLoader: !!controller,
  };
};

export const get: EndpointRoute = (
  Controller,
  methodName,
): EndpointRouteDefinition => {
  return {
    kind: "ENDPOINT",
    exec: async (ctx: RouterContext<unknown[]>) => {
      const { params } = ctx;
      const controllerInstance = new Controller();
      const method = controllerInstance[methodName];
      let data = {};
      if (typeof method === "function") {
        data = (await method({ params })) as typeof data;
      }
      return { data };
    },
    json: true,
    method: RouteMethod.GET,
  };
};

export const post: EndpointRoute = (
  Controller,
  methodName,
): EndpointRouteDefinition => {
  return {
    kind: "ENDPOINT",
    exec: async (ctx: RouterContext<unknown[]>) => {
      const { params } = ctx;

      const instance = new Controller();
      const method = instance[methodName];
      let data = {};
      if (typeof method === "function") {
        data = (await method({ params })) as typeof data;
      }
      return { data };
    },
    json: true,
    method: RouteMethod.POST,
  };
};

export const Route = {
  view,
  get,
  post,
};
