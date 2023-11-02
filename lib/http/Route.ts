type RouteHandler = () => unknown;
type ViewHandler = () => unknown;
type RouteMiddleware = () => unknown;
type RouteGroup = () => unknown;

// interface IRoute {
//   view: ViewHandler;

//   get: RouteHandler;
//   post: RouteHandler;
//   patch: RouteHandler;
//   put: RouteHandler;
//   delete: RouteHandler;

//   middleware: RouteMiddleware;
//   group: RouteGroup;
// }

export class Route {
  static view = () => {};

  static get = () => {};
  static post = () => {};
  static patch = () => {};
  static put = () => {};
  static delete = () => {};

  static middleware = () => {
    return Route;
  };
  static group = () => {};
}

Route.view();
