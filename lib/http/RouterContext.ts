import { Context } from "hono";

import { AsyncLocalStorage } from "node:async_hooks";

export const RouterContext = new AsyncLocalStorage<{
  ctx: Context;
}>();
