interface RouteMatcherResult {
  match: string;
  params: Record<string, string>;
}

type RouteMatcher = (path: string) => RouteMatcherResult;

export function createRouteMatcher(routes: string[]): RouteMatcher {
  return (url: string) => {
    const _url = new URL(url);
    const path = _url.pathname;
    const query = _url.searchParams;
    // Exact match
    if (routes.includes(path)) {
      return {
        match: path,
        params: {},
        query,
      };
    }

    const pathSegments = path.split("/");

    const sortedRoutes = routes.sort(
      (a, b) => a.split("/").length - b.split("/").length,
    );

    const matchedResults = [];

    for (const route of sortedRoutes) {
      const routeSegments = route.split("/");

      if (routeSegments.length < pathSegments.length) {
        continue;
      }

      const matchSegments = [];
      const params: Record<string, string> = {};

      for (let i = 0; i < routeSegments.length; i++) {
        const segment = pathSegments[i];
        const routeSegment = routeSegments[i];

        if (routeSegment === segment) {
          matchSegments.push(routeSegment);
          continue;
        }

        if (routeSegment.startsWith(":")) {
          matchSegments.push(routeSegment);
          const key = routeSegment.replace(":", "").replace("?", "");
          if (segment) {
            params[key] = segment;
          }
        }
      }

      const match = matchSegments.join("/");

      if (routes.includes(match)) {
        matchedResults.push({
          match,
          params,
          query,
        });
      }
    }

    const betterMatch = matchedResults.find((result) => {
      return result.match.startsWith(`/${pathSegments[1]}`);
    });

    if (betterMatch) {
      return betterMatch;
    }

    if (matchedResults[0]) {
      return matchedResults[0];
    }

    return {
      match: "/*",
      params: {},
      query,
    };
  };
}
