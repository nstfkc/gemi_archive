import { Request, Response } from "express";

export type RenderKind = "html" | "route";

export abstract class Controller {
  constructor(protected req: Request, protected res: Response) {}

  protected render = (view: string, data: unknown) => {
    return {
      viewPath: view,
      data,
    };
  };
}
