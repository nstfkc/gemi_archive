import { sign } from "hono/jwt";
import { setCookie, deleteCookie } from "hono/cookie";
import { Context } from "hono";
import { HttpRequest } from "@/lib/http/HttpRequest";
import { User } from "@/app/models/User";

export class BaseAuthController {
  signIn = async (request: HttpRequest) => {
    const token = await sign({ id: 1 }, "secret");
    // setCookie(ctx, "Authorization", token, { maxAge: 1000000, path: "/" });

    return {
      success: true,
    };
  };

  async signUp(request: HttpRequest) {
    const { email, name, password } = await request.getBody();
    console.log({ email, name, password });
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;

    await user.save();

    return {
      success: true,
    };
  }

  signOut = (ctx: Context) => {
    deleteCookie(ctx, "Authorization", { path: "/" });
    return {
      success: true,
    };
  };

  // register = async (ctx) => {
  //   const { email, name, password } = ctx.req.body;
  //   console.log({ email, name, password });
  //   const encryptedPassword = await encrypt(password);

  //   try {
  //     const user = await User.create({
  //       data: {
  //         password: encryptedPassword,
  //         email,
  //         name,
  //         accounts: {
  //           create: {
  //             provider: String(import.meta.env.APP_NAME ?? "Gemijs"),
  //             type: "EmailPassword",
  //             providerAccountId: "",
  //           },
  //         },
  //       },
  //     });

  //     return {
  //       success: true,
  //       data: user,
  //     };
  //   } catch (err) {
  //     return {
  //       success: false,
  //       error: { message: err },
  //     };
  //   }
  // };
}
