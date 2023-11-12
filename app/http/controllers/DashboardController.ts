import { Controller } from "@/lib/http/Controller";

export class DashboardController extends Controller {
  async index() {
    return { message: "Dashboard" };
  }
}
