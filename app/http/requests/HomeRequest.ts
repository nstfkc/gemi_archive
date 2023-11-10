import { Request } from "@/lib/http/Request";
import * as z from "zod";

const schema = z.object({
  name: z.string(),
});

export class HomeRequest extends Request {
  constructor() {
    super(schema);
  }
}
