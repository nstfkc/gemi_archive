import { Request, Response } from "express";

export abstract class Controller {
  constructor(protected req: Request, protected res: Response) {}

  protected render = (view: string, data: unknown) => {
    return {
      kind: "html",
      viewPath: view,
      data,
    };
  };
}
