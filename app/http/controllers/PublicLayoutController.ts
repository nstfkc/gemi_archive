import { Context } from "hono";

export class PublicLayoutController {
  async index(ctx: Context) {
    return { title: "Public layout 2" };
  }
}
