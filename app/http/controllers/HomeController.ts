import type { Request, Response } from "express";
import { Controller } from "@/lib/server/Controller";

function isAuth(req: Request) {
  if (req.cookies["auth"] === "true") {
    return true;
  }
  return false;
}

function Guarded() {
  return function <P, K, T extends (...p: P[]) => K>(
    originalMethod: T,
    _context: ClassMethodDecoratorContext,
  ) {
    function guarded(this: unknown, ...args: P[]) {
      const result = originalMethod.call(this, ...args);

      const middleware = (req: Request, res: Response) => {
        if (isAuth(req)) {
          return result;
        } else {
          return res.redirect("/auth/login");
        }
      };
      return middleware as typeof result;
    }
    return guarded as T;
  };
}

export class HomeController extends Controller {
  index() {
    return { message: "hello world" };
  }
}
