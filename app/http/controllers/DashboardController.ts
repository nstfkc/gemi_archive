import { Controller } from "@/lib/http/Controller";

export class DashboardController extends Controller {
  index() {
    return { message: "Dashboard Message" };
  }
}
