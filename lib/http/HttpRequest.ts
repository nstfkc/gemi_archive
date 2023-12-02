import * as z from "zod";

import { Context } from "hono";
import { AuthenticatedUser } from "../types/global";

export class HttpRequest {
  constructor(private ctx: Context) {}

  user(): AuthenticatedUser {
    return this.ctx.get("jwtPayload");
  }

  getBody() {
    return this.parseBody(z.object({}).passthrough());
  }

  getQuery() {
    return this.parseQuery(z.object({}).passthrough());
  }

  getParams() {
    return this.parseParams(z.object({}).passthrough());
  }

  protected async parseBody<K extends z.ZodRawShape, T extends z.ZodObject<K>>(
    schema: T,
  ): Promise<z.infer<T>> {
    const contentType = this.ctx.req.raw.headers.get("Content-Type");
    let data = {};

    if (contentType === "application/json") {
      data = await this.ctx.req.json();
    }

    return schema.parse(data);
  }

  protected parseQuery<K extends z.ZodRawShape, T extends z.ZodObject<K>>(
    schema: T,
  ): z.infer<T> {
    const data = this.ctx.req.query();
    return schema.partial().parse(data);
  }

  protected parseParams<K extends z.ZodRawShape, T extends z.ZodObject<K>>(
    schema: T,
  ): z.infer<T> {
    const data = this.ctx.req.param();
    return schema.parse(data);
  }
}
