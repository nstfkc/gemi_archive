import { Controller } from "@/lib/server/Controller";

function Guarded() {
  return function (
    originalMethod: () => any,
    _context: ClassMethodDecoratorContext,
  ) {
    function ReplacementMethod(this: any, ...args: any[]) {
      const result = originalMethod.call(this, ...args);

      const middleware = (req, res) => {
        return res.send("404");
      };
      return middleware as typeof result;
    }
    return ReplacementMethod;
  };
}

export class HomeController extends Controller {
  @Guarded()
  index() {
    return { message: "hello world" };
  }
}
