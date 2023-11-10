import { Controller } from "@/lib/http/Controller";

export class AboutController extends Controller {
  index = () => {
    return { message: "About Page Header" };
  };
}
