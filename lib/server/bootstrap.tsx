import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { verify } from "jsonwebtoken";
import { renderToString } from "react-dom/server";
import { api, web } from "@/app/http/routes";
import { RouterContext } from "../http/RouterContext";
import { AuthContext } from "../http/AuthContext";

const views = import.meta.glob(["@/app/views/**/*", "!**/components/*"], {
  eager: true,
});

const viewHandler = (path: string, handler: any, template: string) => {
  return async (req: Request, res: Response) => {
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
  };
};

const viewDataHandler = (_path: string, handler: any) => {
  return async (req: Request, res: Response) => {
    const { data } = await handler.exec({
      req,
      res,
    });
    res.json(data);
  };
};

const apiHandler = (_path: string, handler: any) => {
  return async (req: Request, res: Response) => {
    const { data } = await handler.exec({ req, res });
    res.json(data);
  };
};

const routeViewMap = Object.fromEntries([
  ...Object.entries(web.public).map(([key, routeList]) => {
    return [
      key,
      { viewPath: routeList.viewPath, hasLoader: routeList.hasLoader },
    ];
  }),
  ...Object.entries(web.private).map(([key, routeList]) => {
    return [key, { viewPath: routeList.viewPath, hasLoader: true }];
  }),
]);

const viewRouteAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.cookies["auth"] === "true") {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

const viewJsonRouteAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.cookies["auth"] === "true") {
    next();
  } else {
    res.json({ redirect: "/auth/login" });
  }
};

const apiRouteAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.cookies["auth"] === "true") {
    next();
  } else {
    res.json({ success: false, error: { message: "Not authorized" } });
  }
};

export function bootstrap(template: string) {
  const router = Router();

  router.use(
    (req, res, next) => {
      RouterContext.run({ request: req, response: res }, next);
    },
    (req, _res, next) => {
      const token = String(
        req.headers?.authorization ?? req.cookies["authorization"],
      );
      const user = { id: "1234" };
      AuthContext.run({ user }, next);
    },
  );

  Object.entries(api.public).forEach(([path, handler]) => {
    router[handler.method](`/api${path}`, apiHandler(path, handler));
  });

  Object.entries(api.private).forEach(([path, handler]) => {
    router[handler.method](
      `/api${path}`,
      apiRouteAuthMiddleware,
      apiHandler(path, handler),
    );
  });

  Object.entries(web.public).forEach(([path, handler]) => {
    router.get(`/__json${path}`, viewDataHandler(path, handler));
    router.get(path, viewHandler(path, handler, template));
  });

  Object.entries(web.private).forEach(([path, handler]) => {
    router.get(
      `/__json${path}`,
      viewJsonRouteAuthMiddleware,
      viewDataHandler(path, handler),
    );
    router.get(
      path,
      viewRouteAuthMiddleware,
      viewHandler(path, handler, template),
    );
  });

  return router;
}
