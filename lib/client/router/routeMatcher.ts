type RouteMatcherResult = {
  match: string;
  params: { [key: string]: string };
};

type RouteMatcher = (path: string) => RouteMatcherResult;

export function createRouteMatcher(routes: string[]): RouteMatcher {
  return (path: string) => {
    // Exact match
    if (routes.includes(path)) {
      return {
        match: path,
        params: {},
      };
    }

    const params: Record<string, string> = {};
    // Match routes with variables
    const route = routes.find((route) => {
      const routeParts = route.split("/");
      const pathParts = path.split("/");
      if (routeParts.length !== pathParts.length) {
        return false;
      }

      for (let i = 0; i < routeParts.length; i++) {
        const routePart = routeParts[i];
        const pathPart = pathParts[i];

        if (routePart.startsWith(":")) {
          params[routePart.slice(1).replace("?", "")] = pathPart;
          continue;
        }

        if (routePart !== pathPart) {
          return false;
        }
      }

      return true;
    });

    if (route) {
      return {
        match: route,
        params,
      };
    }

    return {
      match: "/*",
      params: {},
    };
  };
}
