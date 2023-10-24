import { Controller } from "@/lib/Controller";

export class HomeController extends Controller {
  index = () => {
    return "Home";
  };
}
