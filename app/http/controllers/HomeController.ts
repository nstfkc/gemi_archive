import { Controller } from "@/lib/server/Controller";

export class HomeController extends Controller {
  index = () => {
    return { message: "hello world" };
  };
}
