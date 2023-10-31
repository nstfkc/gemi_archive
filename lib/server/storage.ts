import type { Request, Response } from "express";
import { AsyncLocalStorage } from "node:async_hooks";

const storage = new AsyncLocalStorage<{
  request: Request;
  response: Response;
}>();

export { storage };
