import { Controller } from "@/lib/server/Controller";

export class AboutController extends Controller {
  index = () => {
    return this.render("About", { message: "About Page" });
  };

  page = (pageId: string) => {
    return `Page: ${pageId}`;
  };

  foo = (bar: string, baz: string) => {
    return `Page: ${bar} ${baz}`;
  };
}
