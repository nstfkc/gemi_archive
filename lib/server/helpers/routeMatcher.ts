type RouteHandlers = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function createRouteMatcher<T extends RouteHandlers>(routes: T) {
  return (
    url: string,
  ): {
    match: keyof T;
    params: unknown[];
  } => {
    const routeKeys = Object.keys(routes);

    if (routeKeys.includes(url)) {
      return {
        match: url,
        params: [],
      };
    }

    const [, firstSegment, ...urlSegments] = url.split("/");

    const firstSegmentMatches = routeKeys.filter(
      (key) =>
        key.startsWith(`/${firstSegment}`) &&
        key.split("/").length === urlSegments.length + 2,
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
