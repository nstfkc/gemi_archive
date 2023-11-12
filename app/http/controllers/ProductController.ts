import { Controller } from "@/lib/http/Controller";

export class ProductController extends Controller {
  index = () => {
    return { productTitle: "Iphone 15" };
  };
  edit = () => {
    return { action: "Edit Iphone 15" };
  };
}
