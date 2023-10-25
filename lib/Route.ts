import { Request, Response } from "express";
import { Controller } from "./Controller";

interface RouterContext<T> {
  req: Request;
  res: Response;
  params: T;
}

type Todo<T extends string> = T extends string ? unknown : unknown;

type ClassMethodNames<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export function Route<T extends Controller>(
  C: { new (req: Request, res: Response): T },
  method: ClassMethodNames<T>
) {
  return (ctx: RouterContext<Todo<"Type parameters">>) => {
    const { req, res, params } = ctx;
    const instance = new C(req, res);
    const m = instance[method];
    if (typeof m === "function") {
      return m(...params);
    }
  };
}
