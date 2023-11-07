import { RouterContext } from "@/lib/http/RouterContext";
import { Controller } from "@/lib/server/Controller";

// function Guarded() {
//   return function <P, K, T extends (...p: P[]) => K>(
//     originalMethod: T,
//     _context: ClassMethodDecoratorContext,
//   ) {
//     function guarded(this: unknown, ...args: P[]) {
//       const result = originalMethod.call(this, ...args);

//       const middleware = (req: Request, res: Response) => {
//         if (isAuth(req)) {
//           return result;
//         } else {
//           return { redirect: "/auth/login" };
//         }
//       };
//       return middleware as typeof result;
//     }
//     return guarded as T;
//   };
// }

export class HomeController extends Controller {
  index() {
    const ctx = RouterContext.getStore()?.ctx;
    return { message: "hello world" };
  }
}
