import { AsyncLocalStorage } from "node:async_hooks";

const storage = new AsyncLocalStorage<{
  request: Request;
  response: Response;
}>();

export { storage };
