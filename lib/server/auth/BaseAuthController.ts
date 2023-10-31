import { User } from "@/app/modals/User";
import { Controller, RouteMethod } from "../Controller";

interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

export class BaseAuthController extends Controller {
  public login: RouteMethod<LoginParams> = async (ctx) => {
    const { email, password } = ctx.body;
    // const user = await prisma.user.findFirst({
    //   where: { email },
    // });
    //
    const user = await User.findFirst({
      where: { email },
      select: {},
    });
    if (user?.password) {
    }
    // if (user && user.password === password) {
    //   return { success: true };
    // }
    // return { success: false };
  };

  public register: RouteMethod<RegisterParams> = async (ctx) => {
    const { email, name, password } = ctx.body;

    // const user = await User.create({ data: { email, name, password } });
    // return { user };

    const users = await User.findMany();

    return { users: users.toJson() };
  };

  public loginView = () => {
    return {};
  };
}
