import * as z from "zod";
import { HttpRequest } from "@/lib/http/HttpRequest";

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

class TestRequest extends HttpRequest {
  override getBody() {
    return this.parseBody(schema);
  }
}

export default TestRequest;
