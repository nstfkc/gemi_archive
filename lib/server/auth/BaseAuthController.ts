import { addDays } from "date-fns";
import * as jwt from "jsonwebtoken";

import { User } from "@/app/modals/User";
import { Controller, Request } from "../Controller";
import { encrypt, decrypt } from "../helpers/encryption";
import { setCookie } from "../helpers/cookie";
import { createRequest } from "../createRequest";

import * as z from "zod";

const loginRequest = createRequest({
  email: z.string().email(),
  password: z.string(),
});

interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

export class BaseAuthController extends Controller {
  login = loginRequest.next(async ({ email, password }) => {
    const user = await User.findFirst({
      where: { email },
      include: { accounts: true },
    });

    const passwordMatches =
      user?.password && (await decrypt(password, user.password));

    if (!passwordMatches) {
      return {
        success: false,
        error: { message: "Invalid credentials" },
      };
    } else {
      const token = jwt.sign(
        {
          userId: user.id,
          // TODO: A user can have multiple accounts accross multiple organisations
          // But for now we only allow one account, therefore we hardcode the account
          role: user.accounts[0].role,
        },
        // TODO: use env secret
        "SECRET",
      );

      const now = Date.now();

      setCookie("Authorization", `Bearer ${token}`, {
        expires: addDays(now, 1),
        path: "/",
        httpOnly: true,
        sameSite: true,
      });

      return {
        success: true,
      };
    }
  });

  register = async (request: Request<RegisterParams>) => {
    const { email, name, password } = request.body;
    const encryptedPassword = await encrypt(password);

    try {
      const user = await User.create({
        data: {
          password: encryptedPassword,
          email,
          name,
          accounts: {
            create: {
              provider: String(import.meta.env.APP_NAME ?? "Gemijs"),
              type: "EmailPassword",
              providerAccountId: "",
            },
          },
        },
      });

      return {
        success: true,
        data: user,
      };
    } catch (err) {
      return {
        success: false,
        error: { message: err },
      };
    }
  };

  loginView = () => {
    return {};
  };
}
