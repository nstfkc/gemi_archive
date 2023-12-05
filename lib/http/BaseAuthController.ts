import { sign } from "hono/jwt";
import { HttpRequest } from "@/lib/http/HttpRequest";
import { User } from "@/app/models/User";
import { Controller } from "@/lib/http/Controller";
import { AuthenticationError } from "./errors/AuthenticationError";

export class BaseAuthController extends Controller {
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
    const { email } = await request.getBody();

    const user = await User.findUnique({
      where: {
        email: String(email),
      },
    });

    if (!user) {
      throw new AuthenticationError("Invalid credentials");
    }
    const loginToken = "";
    const magicLink = "";
    // Email.send('MagicLink', { magicLink:'', loginToken: '' })
    return {};
  }

  async signInWithMagicLink(request: HttpRequest) {}
  async signInWithLoginCode(request: HttpRequest) {}
  async signInWithSocial(request: HttpRequest) {}

  async signInWithSocialCallback(request: HttpRequest) {}

  signOut() {
    this.deleteCookie("Authorization", { path: "/" });
    return {};
  }
}
