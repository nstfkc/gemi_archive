import { AsyncLocalStorage } from "node:async_hooks";

interface User {
  id: string;
}

const AuthContext = new AsyncLocalStorage<{
  user: User | null;
}>();

export { AuthContext };
