import { Email } from "@/lib/email";
import { Controller } from "@/lib/http/Controller";

export class HomeController extends Controller {
  async index() {
    const email = new Email("auth/MagicLink", {
      loginCode: "1234",
      magicLink: "http://localhost:3000/auth/magic-link",
    });

    const res = await email.send({
      from: "gemi@key5studio.com",
      to: "enesxtufekci@gmail.com",
      subject: "Test",
      debug: true,
    });

    return { message: "Home Test" };
  }
}
