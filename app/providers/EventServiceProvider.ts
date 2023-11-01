import { ServiceProvider } from "@/lib/server/ServiceProvider";
import { User } from "../modals/User";

class EventServiceProvider extends ServiceProvider {
  static boot = () => {
    User;
  };
}
