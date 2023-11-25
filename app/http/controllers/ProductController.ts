import { Controller } from "@/lib/http/Controller";
import TestRequest from "../requests/TestRequest";

export class ProductController extends Controller {
  index = () => {
    return { productTitle: "Iphone 15" };
  };
  edit = () => {
    return { action: "" };
  };

  list = () => {
    return [
      { id: 1, title: "iphone 15" },
      { id: 2, title: "iphone 16" },
    ];
  };

  async test1(request: TestRequest) {
    const body = await request.getBody();
    const query = request.getQuery();
    const params = request.getParams();
    return { body, query, params };
  }
}
