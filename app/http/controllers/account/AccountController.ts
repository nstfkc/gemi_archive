import { Controller } from "@/lib/http/Controller";

export class AccountController extends Controller {
  index = () => {
    return { name: "Enes" };
  };
}
