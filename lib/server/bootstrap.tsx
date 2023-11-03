import { Router } from "express";

import { renderToString } from "react-dom/server";

import { api, web } from "@/app/http/routes";

const views = import.meta.glob(["@/app/views/**/*", "!**/components/*"], {
  eager: true,
});

const routeViewMap = Object.fromEntries(
  Object.entries(web).map(([key, routeList]) => {
    return [
      key,
      { viewPath: routeList.viewPath, hasLoader: routeList.hasLoader },
    ];
  }),
);

export function bootstrap(template: string) {
  const router = Router();

  Object.entries(api).forEach(([path, handler]) => {
    router[handler.method](path, async (req, res) => {
      const { data } = await handler.exec({ req, res });
      res.json(data);
    });
  });

  Object.entries(web).forEach(([path, handler]) => {
    router.get(`/__json${path}`, async (req, res) => {
      const { data } = await handler.exec({
        req,
        res,
      });
      res.json(data);
    });

    router.get(path, async (req, res) => {
      const { data, viewPath } = await handler.exec({
        req,
        res,
      });

      const serverData = {
        routeViewMap,
        routeData: { [path]: data },
        routes: Object.keys(web),
        currentRoute: path,
      };

      let Children = () => (
        <>
          <div>404</div>
        </>
      );

      try {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-assignment
        Children = views[`/app/views/${viewPath}.tsx`].default;
      } catch (err) {
        console.log(err);
        Children = () => <div>Cannot find {viewPath} view</div>;
      }

      const scripts = `<script>window.serverData = '${JSON.stringify(
        serverData,
      )}';</script>`;

      const appHtml = renderToString(<Children data={data} />);

      const html = template
        .replace(`<!--app-html-->`, appHtml)
        .replace(`<!--server-data-->`, scripts);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    });
  });

  return router;
}
