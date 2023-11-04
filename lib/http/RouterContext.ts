import type { Request, Response } from "express";
import { AsyncLocalStorage } from "node:async_hooks";

export const RouterContext = new AsyncLocalStorage<{
  request: Request;
  response: Response;
}>();
