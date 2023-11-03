import { Controller } from "@/lib/server/Controller";

export class AccountController extends Controller {
  index = () => {
    return { name: "Enes" };
  };
}
