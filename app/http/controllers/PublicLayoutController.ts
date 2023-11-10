import { Context } from "hono";

export class PublicLayoutController {
  index(ctx: Context) {
    return { title: "Public layout 2" };
  }
}
