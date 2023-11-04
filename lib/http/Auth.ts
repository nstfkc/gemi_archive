import { AuthContext } from "./AuthContext";

export class Auth {
  static user = () => {
    const storage = AuthContext.getStore();
    return storage?.user;
  };
}
