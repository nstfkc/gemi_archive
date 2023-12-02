import { Controller } from "@/lib/http/Controller";
import { HttpRequest } from "@/lib/http/HttpRequest";

export class ProductController extends Controller {
  edit(request: HttpRequest) {
    const { productId } = request.getParams();
    return { message: `Product ${productId}` };
  }

  show(request: HttpRequest) {
    const { productId } = request.getParams();
    return { title: `Product Detail ${productId}` };
  }
}
