import { Request, Response } from "express";

export abstract class Controller {
  constructor(protected req: Request, protected res: Response) {}
}
