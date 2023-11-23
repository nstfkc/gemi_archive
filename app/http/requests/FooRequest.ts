import { HttpRequest } from "@/lib/http/Request";

class FooRequest extends HttpRequest {
  fields = {
    name: "string|required",
  };
}

export default FooRequest;
