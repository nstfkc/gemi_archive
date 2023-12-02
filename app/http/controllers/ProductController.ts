import { Controller } from "@/lib/http/Controller";
import { HttpRequest } from "@/lib/http/HttpRequest";

export class ProductController extends Controller {
  edit(request: HttpRequest) {
    const { productId } = request.getParams();
    console.log(productId);
    return { message: `Product ${productId}` };
  }
}
