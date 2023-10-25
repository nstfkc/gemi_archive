type RouteParams = {
  [key: string]: string;
};

type RouteHandlers = {
  [key: string]: (params: RouteParams) => void;
};

export function createRouteMatcher(routes: RouteHandlers) {
  return (
    url: string
  ): {
    match: string;
    params: unknown[];
  } => {
    const routeKeys = Object.keys(routes);
    const [, firstSegment, ...urlSegments] = url.split("/");

    const firstSegmentMatches = routeKeys.filter(
      (key) =>
        key.startsWith(`/${firstSegment}`) &&
        key.split("/").length === urlSegments.length + 2
    );

    const match = firstSegmentMatches[0];
    const matchSegments = match.split("/");
    const params = [];
    for (const segment of matchSegments) {
      if (segment.includes(":")) {
        const idx = matchSegments.indexOf(segment);
        params.push(urlSegments[idx - 2]);
      }
    }

    return {
      match,
      params,
    };
  };
}
