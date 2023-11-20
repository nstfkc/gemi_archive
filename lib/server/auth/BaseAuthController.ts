import { sign } from "hono/jwt";
import { setCookie, deleteCookie } from "hono/cookie";
import { Context } from "hono";

export class BaseAuthController {
  login = async (ctx: Context) => {
    const token = await sign({ id: 1 }, "secret");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setCookie(ctx, "Authorization", token, { maxAge: 1000000, path: "/" });
    return {
      success: true,
    };
  };

  logout = (ctx: Context) => {
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

  loginView = () => {
    return {};
  };
}
