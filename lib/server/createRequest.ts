import * as z from "zod";
import { RouterContext } from "../http/RouterContext";

export function createRequest<T extends z.ZodRawShape>(shape: T) {
  const schema = z.object(shape);
  const next = <T>(cb: (fields: z.infer<typeof schema>) => Promise<T>) => {
    return async (ctx: any) => {
      RouterContext.enterWith({ request: ctx.req, response: ctx.res });
      const result = schema.safeParse(ctx.req.body);
      if (result.success === true) {
        return await cb(result.data);
      }
      return { success: false, ...result.error };
    };
  };
  return {
    next,
  };
}
