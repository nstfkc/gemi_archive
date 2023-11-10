import { Context } from "hono";

export class HttpRequest<Body, Params> {
  constructor(private ctx: Context) {}

  params() {
    return this.ctx.req.param() as Params;
  }

  async validate<T>(schema: T) {
    const body = (await this.ctx.req.json()) as Body;
    try {
      return {
        input: schema.parse(body),
      };
    } catch (err) {
      // Do something
    }
  }
}
