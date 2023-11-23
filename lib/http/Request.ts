import { Context } from "hono";

export class HttpRequest {
  fields = {};
  constructor(private ctx: Context) {}

  body() {
    return this.fields;
  }

  async validate() {
    const json = await this.ctx.req.json();
    return json;
  }
}
