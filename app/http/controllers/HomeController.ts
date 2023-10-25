import { Controller } from "@/lib/server/Controller";

export class HomeController extends Controller {
  index = () => {
    return this.render("Home", { message: "hello world" });
  };
}
