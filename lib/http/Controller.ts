import { Request, Response } from "express";

export interface Ctx<Params extends Record<string, string> = {}> {
  req: Request;
  res: Response;
  params: Params;
}

export class Controller {}
