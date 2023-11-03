import { Request, Response } from "express";

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
