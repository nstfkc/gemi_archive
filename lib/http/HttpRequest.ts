import * as z from "zod";

import { Context } from "hono";

export class HttpRequest {
  protected schema = z.object({});

  constructor(private ctx: Context) {}

  body() {
    return this.schema;
  }

  async validate() {
    const json = await this.ctx.req.json();
    const parsed = this.schema.parse(json);
    return parsed;
  }
}
