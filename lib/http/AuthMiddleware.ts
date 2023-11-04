import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { Middleware } from "./Middleware";

export class AuthMiddleware extends Middleware {
  payload: any;
  constructor(private req: Request) {
    super();

    const token = String(
      this.req.headers?.authorization ?? this.req.cookies["authorization"],
    );
    this.payload = verify(token, "secret");
  }

  viewJson = (_req: Request, res: Response, next: NextFunction) => {
    if (this.payload) {
      return next();
    } else {
      return res.json({ redirect: "/auth/login" });
    }
  };

  api = () => {
    return () => {
      return { success: false, error: { message: "Not authorized" } };
    };
  };

  redirect = () => {};

  bypass = () => {
    return () => {
      this.next();
    };
  };
}
