import * as z from "zod";
import { HttpRequest } from "@/lib/http/HttpRequest";

class ProductCreateRequest extends HttpRequest {
  schema = z.object({
    name: z.string().min(3).max(255),
    price: z.number(),
    description: z.string(),
  });

  override getBody() {
    return this.parseBody(this.schema);
  }
}

export default ProductCreateRequest;
