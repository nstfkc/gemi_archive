import { sign } from "hono/jwt";
import { HttpRequest } from "@/lib/http/HttpRequest";
import { User } from "@/app/models/User";
import { Controller } from "@/lib/http/Controller";
import { AuthenticationError } from "./errors/AuthenticationError";
import { Email } from "../email";
import { generateRandomString } from "../utils/generateRandomString";

export class BaseAuthController extends Controller {
  private async signToken(user: User) {
    const token = await sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.SECRET ?? "secret",
    );

    this.setCookie("Authorization", token, {
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  }
  async signIn(request: HttpRequest) {
    const { email, password } = await request.getBody();

    const user = await User.findUnique({
      where: {
        email: String(email),
      },
    });

    if (!user) {
      throw new AuthenticationError("Invalid credentials");
    }

    const isPasswordValid = await Bun.password.verify(
      String(password),
      user.password,
    );

    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid credentials");
    }

    const token = await sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      },
      process.env.SECRET ?? "secret",
    );

    this.setCookie("Authorization", token, {
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return {};
  }

  async signUp(request: HttpRequest) {
    const { email, name, password } = await request.getBody();

    await User.create({
      data: {
        email: String(email),
        name: String(name),
        password: await Bun.password.hash(String(password)),
        accounts: {
          create: {
            provider: String(import.meta.env.APP_NAME ?? "Gemijs"),
            type: "EmailPassword",
            providerAccountId: "",
          },
        },
      },
    });

    return {};
  }

  async signInPasswordless(request: HttpRequest) {
    const { email } = (await request.getBody()) as { email: string };

    const user = await User.findUnique({
      where: {
        email: String(email),
      },
    });

    if (!user) {
      throw new AuthenticationError("Invalid credentials");
    }

    const loginCode = `${generateRandomString(5)}-${generateRandomString(5)}`;

    const magicLink = new URL(`${process.env.HOST}/auth/magic-link`);
    magicLink.searchParams.append("email", email);
    magicLink.searchParams.append(
      "token",
      Buffer.from(loginCode).toString("base64"),
    );

    try {
      await User.update({
        where: { email: String(email) },
        data: { loginCode, loginCodeCreatedAt: new Date(Date.now()) },
      });
    } catch (err) {
      console.log(err);
      // Do something
    }

    const magicLinkEmail = new Email("auth/MagicLink", {
      loginCode,
      magicLink: magicLink.toString(),
    });

    await magicLinkEmail.send({
      from: "gemi@key5studio.com",
      to: "enesxtufekci@gmail.com",
      subject: "Test",
      debug: true,
    });

    // Email.send('MagicLink', { magicLink:'', loginToken: '' })
    return {};
  }

  async signInWithMagicLink(request: HttpRequest) {
    const { email, token } = request.getQuery() as {
      email: string;
      token: string;
    };

    if (!(email && token)) {
      return { success: false };
    }

    const loginCode = Buffer.from(token, "base64").toString("utf8");

    const user = await User.findUnique({ where: { email, loginCode } });
    if (user && user.loginCodeCreatedAt) {
      const createdAt = new Date(user.loginCodeCreatedAt);
      const now = new Date(Date.now());
      const diff = now.valueOf() - createdAt.valueOf();

      if (diff > 1000 * 60 * 5) {
        return { success: false };
      }
      const token = await sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        process.env.SECRET ?? "secret",
      );

      this.setCookie("Authorization", token, {
        path: "/",
        maxAge: 60 * 60 * 24,
      });
      return { success: true };
    }
    return { success: false };
  }

  async signInWithLoginCode(request: HttpRequest) {}
  async signInWithSocial(request: HttpRequest) {}
  async signInWithSocialCallback(request: HttpRequest) {}

  signOut() {
    this.deleteCookie("Authorization", { path: "/" });
    return {};
  }
}
