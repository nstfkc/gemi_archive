import { Controller, RouteMethod } from "../Controller";
import { prisma } from "@/db/orm";

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
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (user && user.password === password) {
      return { success: true };
    }
    return { success: false };
  };

  public register: RouteMethod<RegisterParams> = async (ctx) => {
    const { email, name, password } = ctx.body;

    const user = await prisma.user.create({ data: { email, name, password } });
    return { user };
  };

  public loginView = () => {
    return {};
  };
}
