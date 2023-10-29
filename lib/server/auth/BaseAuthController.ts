import { Controller, RouteMethod } from "../Controller";

interface LoginParams {
  email: string;
  password: string;
}

export class BaseAuthController extends Controller {
  public login: RouteMethod<LoginParams> = (ctx) => {
    const { email, password } = ctx.body;

    if (email === "hi" && password === "pass") {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
      };
    }
  };

  public loginView = () => {
    return {};
  };
}
