import { Controller } from "@/lib/server/Controller";

export class AboutController extends Controller {
  index = () => {
    return { message: "About Page Header" };
  };
}
