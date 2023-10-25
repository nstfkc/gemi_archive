import { Controller } from "@/lib/Controller";

export class HomeController extends Controller {
  index = () => {
    return this.render("Home", { message: "hello world" });
  };

  page = (pageId: string) => {
    return `Page: ${pageId}`;
  };

  foo = (bar: string, baz: string) => {
    return `Page: ${bar} ${baz}`;
  };
}
