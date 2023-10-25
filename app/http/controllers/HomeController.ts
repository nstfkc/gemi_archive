import { Controller } from "@/lib/Controller";

export class HomeController extends Controller {
  index = () => {
    return this.req.originalUrl;
  };

  page = (pageId: string) => {
    return `Page: ${pageId}`;
  };

  foo = (bar: string, baz: string) => {
    return `Page: ${bar} ${baz}`;
  };
}
