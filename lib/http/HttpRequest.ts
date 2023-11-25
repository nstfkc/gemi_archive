import * as z from "zod";

import { Context } from "hono";

export class HttpRequest {
  constructor(private ctx: Context) {}

  getBody() {
    return this.parseBody(z.object({}));
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
}
