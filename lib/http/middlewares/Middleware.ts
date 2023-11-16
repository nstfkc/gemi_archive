import { Context } from "hono";

export abstract class Middleware {
  abstract handle(
    ctx: Context,
    next: VoidFunction,
  ): Promise<void> | Promise<Response>;
}
