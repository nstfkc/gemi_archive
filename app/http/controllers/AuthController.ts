import { BaseAuthController } from "@/lib/http/BaseAuthController";

export class AuthController extends BaseAuthController {
  protected magicLinkSender = "gemi@key5studio.com";
  protected magicLinkSubject = "Login to Gemi";
}
