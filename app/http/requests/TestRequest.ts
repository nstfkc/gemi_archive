import * as z from "zod";
import { HttpRequest } from "@/lib/http/HttpRequest";

class TestRequest extends HttpRequest {
  protected schema = z.object({
    //
    name: z.string(),
    age: z.number(),
  });
}

export default TestRequest;
