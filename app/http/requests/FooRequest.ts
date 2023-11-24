import * as z from "zod";
import { HttpRequest } from "@/lib/http/HttpRequest";

class FooRequest extends HttpRequest {
  protected schema = z.object({
    name: z.string().nullable(),
    age: z.number(),
  });
}

export default FooRequest;
