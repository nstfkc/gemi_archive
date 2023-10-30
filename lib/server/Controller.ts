export abstract class Controller {}

export type RouteMethod<Body = object, Params = object> = (ctx: {
  body: Body;
  params: Params;
}) => Promise<Record<string, unknown>> | Record<string, unknown>;
