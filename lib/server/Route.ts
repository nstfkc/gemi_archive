import { Request, Response } from "express";
import { Controller, RenderKind } from "./Controller";

interface RouterContext<T> {
  req: Request;
  res: Response;
  params: T;
  kind: RenderKind;
}

type ClassMethodNames<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export function view<T extends Controller, K extends ClassMethodNames<T>>(
  viewPath: string,
  [Controller, method]: [
    { new (req: Request, res: Response, kind: RenderKind): T },
    K,
  ],
) {
  return {
    exec: (ctx: RouterContext<any[]>) => {
      const { req, res, params, kind } = ctx;
      const instance = new Controller(req, res, kind);
      const m = instance[method];
      if (typeof m === "function") {
        const data = m(...params);
        if (typeof data === "function") {
          const result = data(req, res);
          return { data: result, viewPath };
        }
        return { data, viewPath };
      }
    },
    viewPath,
  };
}

export function get<T extends Controller>(
  C: { new (req: Request, res: Response, kind: RenderKind): T },
  method: ClassMethodNames<T>,
) {
  return {
    exec: (ctx: RouterContext<any[]>) => {
      const { req, res, params, kind } = ctx;
      const instance = new C(req, res, kind);
      const m = instance[method];
      if (typeof m === "function") {
        return m(...params);
      }
    },
  };
}

export const Route = {
  view,
  get,
};
