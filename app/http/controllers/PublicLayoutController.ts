import { Controller } from "@/lib/http/Controller";

export class PublicLayoutController extends Controller {
  index() {
    return { title: "Public layout" };
  }
}
