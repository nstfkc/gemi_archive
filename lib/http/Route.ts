import { Request, Response } from "express";
import { Controller } from "../server/Controller";

type MaybePromise<T> = Promise<T> | T;
type RouteKind = "VIEW" | "ENDPOINT";
enum RouteMethod {
  GET = "GET",
  POST = "POST",
}

interface RouteDefinition {
  kind: RouteKind;
}

interface RouterContext<T> {
  req: Request;
  res: Response;
  params: T;
}

interface ViewRouteDefinition extends RouteDefinition {
  kind: "VIEW";
  exec: (
    ctx: RouterContext<unknown[]>,
  ) => Promise<{ data: unknown; viewPath: string }>;
  viewPath: string;
  hasLoader: boolean;
  method: RouteMethod.GET;
  json: false;
}

type Req = "req";
type Res = "res";

type ClassMethodNames<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

type ViewRouteHandler = <T extends Controller, K extends ClassMethodNames<T>>(
  viewPath: string,
  controller?:
    | [{ new (): T }, K]
    | ((req: Request, res: Response) => MaybePromise<unknown>),
) => ViewRouteDefinition;

type RouteHandler = () => unknown;
type RouteMiddleware = () => unknown;
type RouteGroup = () => unknown;

export class Route {
  static view: ViewRouteHandler = () => {};

  static get = () => {};
  static post = () => {};
  static patch = () => {};
  static put = () => {};
  static delete = () => {};

  static middleware = () => {
    return Route;
  };
  static group = () => {};
}

Route.view("Test");
Route.view("Test", (req, res) => {});

class PostControler extends Controller {
  list = () => {};
  show = () => {};
}

class AccountController extends Controller {
  index = () => {};
}

const web = {
  public: {
    "/": Route.view("Home"),
    "/posts": Route.view("Posts", [PostControler, "list"]),
    "/post/:postId": Route.view("Posts", [PostControler, "show"]),
    "/about": Route.view("About", () => {
      return { companyName: "Acme inc." };
    }),
  },
  private: {
    "/account": Route.view("Account", [AccountController, "index"]),
  },
};

export interface Dictionary<T> {
  [key: string]: T;
}

export interface ParamsDictionary {
  [key: string]: string;
}
export type ParamsArray = string[];
export type Params = ParamsDictionary | ParamsArray;

export type PathParams = string | RegExp | Array<string | RegExp>;

type RemoveTail<
  S extends string,
  Tail extends string,
> = S extends `${infer P}${Tail}` ? P : S;
type GetRouteParameter<S extends string> = RemoveTail<
  RemoveTail<RemoveTail<S, `/${string}`>, `-${string}`>,
  `.${string}`
>;

export type RouteParameters<Route extends string> = string extends Route
  ? ParamsDictionary
  : Route extends `${string}(${string}`
  ? ParamsDictionary // TODO: handling for regex parameters
  : Route extends `${string}:${infer Rest}`
  ? (GetRouteParameter<Rest> extends never
      ? ParamsDictionary
      : GetRouteParameter<Rest> extends `${infer ParamName}?`
      ? { [P in ParamName]?: string }
      : { [P in GetRouteParameter<Rest>]: string }) &
      (Rest extends `${GetRouteParameter<Rest>}${infer Next}`
        ? RouteParameters<Next>
        : unknown)
  : {};
