import { Request, Response } from "express";
import { Controller } from "./Controller";

type ClassMethodNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export function Route<T extends Controller>(
  C: { new (): T },
  method: ClassMethodNames<T>
) {
  const instance = new C();
  const m = instance[method];

  return (req: Request, res: Response) => {
    if (typeof m === "function") {
      return m.call(instance, {}, { req, res });
    }
  };
}
