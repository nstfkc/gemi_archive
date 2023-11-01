import * as z from "zod";

export function createRequest<T extends z.ZodRawShape>(shape: T) {
  const schema = z.object(shape);
  const next = <T>(cb: (fields: z.infer<typeof schema>) => Promise<T>) => {
    return async (req: Request) => {
      const result = schema.safeParse(req.body);
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
