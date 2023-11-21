export function createRouteMatcher(routes: string[]) {
  return (
    url: string,
  ): {
    match: string;
    params: Record<string, string>;
  } => {
    const urlSegments = url.split("/");
    const [, firstSegment] = urlSegments;

    if (routes.includes(url)) {
      return { match: url, params: {} };
    }

    const firstSegmentMatches = routes.filter((key) => {
      const startsWithVariable = key.split("/")[1].includes(":");
      const startsWith = key.startsWith(`/${firstSegment}`);
      const lengthMatches = key.split("/").length >= urlSegments.length;

      return (startsWith || startsWithVariable) && lengthMatches;
    });

    const match = firstSegmentMatches[0];
    const matchSegments = match.split("/");
    const params: Record<string, string> = {};

    for (const segment of matchSegments) {
      if (segment.includes(":")) {
        const idx = matchSegments.indexOf(segment);
        if (urlSegments[idx]) {
          params[segment.replace(":", "").replace("?", "")] = urlSegments[idx];
        }
      }
    }

    return {
      match,
      params,
    };
  };
}
