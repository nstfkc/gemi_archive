import { prisma } from "@/db/orm";

function wrap<T, U>(fn: (...args: T[]) => Promise<U>) {
  return async (...args: T[]) => {
    const result = await fn(...args);
    return result;
  };
}

class BaseModel {}

type UserData = Parameters<typeof prisma.user.create>[0]["data"];

export const Model = {
  user: class extends BaseModel {
    public id: UserData["id"];
    public name: UserData["name"];
    public email: UserData["email"];
    public password: UserData["password"] = null as any;
    public sessions: UserData["sessions"];
    public accounts: UserData["accounts"];

    constructor() {
      super();
    }

    save() {
      return prisma.user.create({
        data: {
          id: this.id,
          name: this.name,
          email: this.email,
          password: this.password,
          sessions: this.sessions,
          accounts: this.accounts,
        },
      });
    }

    static findFirst = wrap(prisma.user.findFirst);
    static findUnique = wrap(prisma.user.findUnique);
    static create = wrap(prisma.user.create);
    static update = prisma.user.update;
  },
};
