import { Controller } from "@/lib/http/Controller";
import { HttpRequest } from "@/lib/http/HttpRequest";

export class AppLayoutController extends Controller {
  index(request: HttpRequest) {
    const user = request.user();
    return { user };
  }
}
