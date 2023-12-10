import { sign } from "hono/jwt";
import { HttpRequest } from "@/lib/http/HttpRequest";
import { User } from "@/app/models/User";
import { VerificationToken } from "@/app/models/VerificationToken";
import { Controller } from "@/lib/http/Controller";
import { AuthenticationError } from "./errors/AuthenticationError";
import { Email } from "../email";
import { generateRandomString } from "../utils/generateRandomString";

export class BaseAuthController extends Controller {
  protected googleScope = "https://www.googleapis.com/auth/userinfo.profile";
  protected magicLinkSender = "";
  protected magicLinkSubject = "";

  private getGoogleSignInUrl() {
    const searchParams = new URLSearchParams({
      scope: this.googleScope,
      include_granted_scopes: "true",
      response_type: "token",
      state: "state_parameter_passthrough_value",
      redirect_uri: `${process.env.HOST}/auth/google/callback`,
      client_id: process.env.GOOGLE_CLIENT_ID!,
    });

    const host = "https://accounts.google.com/o/oauth2/v2/auth";
    const url = [host, searchParams.toString()].join("?");

    return url;
  }

  signInView() {
    return { googleSignInUrl: this.getGoogleSignInUrl() };
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

    const isPasswordValid = await Bun.password.verify(String(password), "");

    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid credentials");
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
    return {};
  }

  async signUp(request: HttpRequest) {
    const { email, name } = await request.getBody();

    await User.create({
      data: {
        email: String(email),
        name: String(name),
      },
    });

    return {};
  }

  async signInPasswordless(request: HttpRequest) {
    const { email } = (await request.getBody()) as { email: string };

    const token = `${generateRandomString(5)}${generateRandomString(5)}`;

    const magicLink = new URL(`${process.env.HOST}/auth/magic-link`);
    magicLink.searchParams.append("email", email);
    magicLink.searchParams.append(
      "token",
      Buffer.from(token).toString("base64"),
    );

    try {
      await VerificationToken.create({
        data: {
          identifier: email,
          token,
          expires: new Date(Date.now() + 1000 * 60 * 5),
        },
      });
    } catch (err) {
      console.log(err);
      // Do something
    }

    const magicLinkEmail = new Email("auth/MagicLink", {
      token,
      magicLink: magicLink.toString(),
    });

    await magicLinkEmail.send({
      from: this.magicLinkSender,
      to: email,
      subject: this.magicLinkSender,
    });

    return { email };
  }

  async signInWithMagicLink(request: HttpRequest) {
    const { email, token } = request.getQuery() as {
      email: string;
      token: string;
    };

    if (!(email && token)) {
      return { success: false };
    }

    const verificationCode = await VerificationToken.findFirst({
      where: {
        identifier: email,
        token: Buffer.from(token, "base64").toString("utf8"),
      },
    });

    if (!verificationCode) {
      return { success: false };
    }

    const isVerificationTokenExpired =
      new Date(verificationCode.expires).valueOf() < Date.now();

    if (isVerificationTokenExpired) {
      return { success: false };
    }

    let user = await User.findUnique({ where: { email } });

    if (!user) {
      user = await User.create({
        data: {
          email: String(email),
          name: "",
        },
      });
    }

    if (user) {
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

  async oauthSignIn(request: HttpRequest) {
    const query = request.getQuery();

    try {
      const res = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${query.access_token}`,
      );

      const data = (await res.json()) as { email: string; name: string };

      if (data?.email && data?.name) {
        let user;

        try {
          user = await User.findUnique({ where: { email: data.email } });
        } catch (err) {
          // Do something
        }

        if (!user) {
          try {
            user = await User.create({
              data: { email: data.email, name: data.name },
            });
          } catch (err) {
            // Do something
          }
        }

        if (user) {
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
          return {};
        }
      }

      throw Error("Can not login");
    } catch (err) {
      console.log(err);
      // Do something
    }

    return {};
  }

  async signInWithToken(request: HttpRequest) {
    const { code, email } = (await request.getBody()) as {
      code: string;
      email: string;
    };

    const verificationToken = await VerificationToken.findFirst({
      where: {
        identifier: email,
        token: code,
      },
    });

    if (!verificationToken) {
      throw new AuthenticationError("Invalid credentials");
    }

    const isTokenExpired =
      new Date(verificationToken.expires).valueOf() < Date.now();

    if (isTokenExpired) {
      throw new AuthenticationError("Invalid credentials");
    }

    let user = await User.findUnique({ where: { email } });

    if (!user) {
      user = await User.create({
        data: {
          email,
          name: "",
        },
      });
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

  signOut() {
    this.deleteCookie("Authorization", { path: "/" });
    return {};
  }
}
