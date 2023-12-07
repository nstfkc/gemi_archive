import { BaseAuthController } from "@/lib/http/BaseAuthController";

export class AuthController extends BaseAuthController {
  protected googleScope = "https://www.googleapis.com/auth/userinfo.profile";
}
