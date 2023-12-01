import { Controller } from "@/lib/http/Controller";
import { HttpRequest } from "@/lib/http/HttpRequest";

export class DashboardController extends Controller {
  index(request: HttpRequest) {
    return { message: "Dashboard Message" };
  }
}
