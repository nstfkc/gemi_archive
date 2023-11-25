import * as z from "zod";
import { HttpRequest } from "@/lib/http/HttpRequest";

class TestRequest extends HttpRequest {
  schema = z.object({
    name: z.string(),
    age: z.number(),
  });

  query = z.object({
    page: z.string().transform((val) => parseInt(val)),
  });

  params = z.object({
    id: z
      .string()
      .transform((val) => parseInt(val))
      .optional(),
  });

  override getParams() {
    return this.parseParams(this.params);
  }

  override getQuery() {
    return this.parseQuery(this.query);
  }

  override getBody() {
    return this.parseBody(this.schema);
  }
}

export default TestRequest;
