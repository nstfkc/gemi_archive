import { Controller } from "@/lib/http/Controller";

export class HomeController extends Controller {
  index() {
    return { message: "Hello" };
  }
}
