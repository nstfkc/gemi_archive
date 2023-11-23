import { HttpRequest } from "@/lib/http/Request";

class TestRequest extends HttpRequest {
  fields = {
    name: "string|required",
  };
}

export default TestRequest;
