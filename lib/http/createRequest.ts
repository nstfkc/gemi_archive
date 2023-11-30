import { Context } from "hono";
import { HttpRequest } from "./HttpRequest";
import methodRequestMap from "./methodRequestMap.json";

const reqs = import.meta.glob("../../app/http/**/*Request.ts", { eager: true });

export function createRequest(ctx: Context, name: string) {
  let Request = HttpRequest;
  const reqPath = methodRequestMap[name];
  if (!reqPath) {
    return new Request(ctx);
  }
  const res = Object.entries(reqs).find(([key]) =>
    key.includes(reqPath.split("/requests")[1]),
  );

  if (res) {
    Request = res[1].default;
  }

  return new Request(ctx);
}
