// @ts-expect-error
import { prisma } from "@/db/orm";
import { Auth } from "@/lib/http/Auth";

export async function encrypt(str: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // TODO: retrieve from process.env.SECRET
    const salt = randomBytes(16).toString("hex");

    scrypt(str, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
}

export async function verifyEncriptedValue(
  str: string,
  hash: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    scrypt(str, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString("hex"));
    });
  });
}

class Modal {}

function HiddenFields(fields: string[]) {
  function hideFields<T extends Function>(fn: T): T {
    return (...args) =>
      fn(...args).then((res: any) => {
        function transform(entry) {
          return Object.fromEntries(
            Object.entries(entry).map(([key, value]) => {
              if (fields.includes(key)) {
                return [key, ""];
              }
              return [key, value];
            }),
          );
        }
        if (Array.isArray(res)) {
          return res.map((entry) => transform(entry));
        }
        return transform(res);
      });
  }
  return <T extends any>(C: T, ctx: ClassDecoratorContext) => {
    return class extends C {
      static hiddenFields = fields;
      static findFirst = hideFields(C.findFirst);
      static findFirstOrThrow = hideFields(C.findFirstOrThrow);
      static findMany = hideFields(C.findMany);
      static create = hideFields(C.create);
    } as T;
  };
}

function EncryptedFields(fields: string[]) {
  function wrap(fn) {
    return async (params) => {
      if (params.data) {
        const { data, ...rest } = params;
        const entries = await Promise.all(
          Object.entries(data).map(async ([key, value]) => {
            if (fields.includes(key)) {
              return [key, await encrypt(key, value)];
            }
            return [key, value];
          }),
        );
        const _data = Object.fromEntries(entries);
        return fn({ data: _data, ...rest });
      }
    };
  }

  return <T extends any>(C: T, ctx: ClassDecoratorContext) => {
    return class extends C {
      static create = wrap(C.create);
    } as T;
  };
}

class Collection<Model> {
  constructor(
    private data: Model,
    private hiddenFields: string[],
  ) {}

  toJson = () => {
    return this.data;
  };
}

function wrap<T, U>(fn: (...args: T[]) => U) {
  return async (...args: T[]) => {
    const result = await fn(...args);
    return new Collection(result, []);
  };
}

class BaseUser extends Modal {
  protected table = "user";
  protected fields = prisma.user.fields;
  protected static schema = prisma.user;
  protected static hiddenFields: string[] = [];

  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: string,
  ) {
    super();
  }

  static findFirst = async (...args) => {
    const result = await prisma.user.findFirst(...args);
    await prisma.$disconnect();
    return result;
  };
  static findFirstOrThrow = prisma.user.findFirstOrThrow;
  static findMany = prisma.user.findMany;

  static create = prisma.user.create;

  save = () => {
    prisma.user.create({ data: { name: this.name } });
  };
}

export class User extends BaseUser {}
