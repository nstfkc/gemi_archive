import { Request as ERequest } from "express";

export abstract class Controller {}

export type Request<Body = object, Params = object> = ERequest<
  Params,
  null,
  Body
>;
