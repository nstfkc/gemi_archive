import * as z from "zod";

import { Context } from "hono";

export class HttpRequest {
  constructor(private ctx: Context) {}

  getBody() {
    return this.parseBody(z.object({}));
  }

  getQuery() {
    return this.parseQuery(z.object({}));
  }

  getParams() {
    return this.parseQuery(z.object({}));
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