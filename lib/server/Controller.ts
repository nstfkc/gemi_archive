export abstract class Controller {}

export type RouteMethod<Body = object, Params = object> = (ctx: {
  body: Body;
  params: Params;
}) => Record<string, unknown>;
