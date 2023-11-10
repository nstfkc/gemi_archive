import { Controller } from "@/lib/http/Controller";

export class HomeController extends Controller {
  async index() {
    return { message: "Hello" };
  }
}
