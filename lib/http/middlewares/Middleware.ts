import { Context } from "hono";

export abstract class Middleware {
  abstract handle(
    ctx: Context,
    next: VoidFunction,
  ): void | Promise<void> | Response;
}
