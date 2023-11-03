import type { Express, Request, Response } from "express";
import { renderToString } from "react-dom/server";

import { api, web } from "@/app/http/routes";
import { storage } from "./storage";

const routeViewMap = Object.fromEntries(
  Object.entries(web).map(([key, routeList]) => {
    return [
      key,
      { viewPath: routeList.viewPath, hasLoader: routeList.hasLoader },
    ];
  }),
);

const handleView =
  (path: keyof typeof web, html: string) =>
  async (req: Request, res: Response) => {
    const handler = web[path];
    const { data, viewPath } = await handler.exec({
      req,
      res,
      params: req.params as any,
    });
    const serverData = {
      routeViewMap,
      routeData: { [path]: data },
      routes: Object.keys(web),
      currentRoute: path,
    };
    const Children = (await import(`../../app/views/${viewPath}.tsx`)).default;
    const scripts = `<script>window.serverData = '${JSON.stringify(
      serverData,
    )}';</script>`;

    const appHtml = renderToString(<Children data={data} />);

    return html
      .replace(`<!--app-html-->`, appHtml)
      .replace(`<!--server-data-->`, scripts);
  };

/* export const viewDataHandler = (req: Request) => {
 *   const { data } = await handler.exec({
 *     req,
 *     res,
 *     params: req.params as any,
 *   });
 *   res.json(data);
 * };
 *  */

const webPaths = Object.keys(web);

export default {
  webPaths,
  handleView,
};

/* export async function bootstrap(
 *   app: Express,
 *   getTemplate: (url: string) => Promise<string>,
 *   cb: (e: Error) => void,
 * ) {
 *   Object.entries(web).forEach(([path, handler]) => {
 *     app.get(path, async (req, res) => {
 *       const viewHandler = handleView(req, res);
 *
 *       res.status(200).set({ "Content-Type": "text/html" }).end(html);
 *     });
 *     app.get(`/__json${path}`, async (req, res) => {
 *
 *     });
 *   });
 * }
 *
 * export default bootstrap; */
