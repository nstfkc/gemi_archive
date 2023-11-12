export function createRouteMatcher(routes: string[]) {
  return (
    url: string,
  ): {
    match: string;
    params: Record<string, string>;
  } => {
    if (routes.includes(url)) {
      return {
        match: url,
        params: {},
      };
    }

    const [, firstSegment] = url.split("/");

    const firstSegmentMatches = routes.filter((key) => {
      const startsWith =
        key.startsWith(`/${firstSegment}`) || key.split("/")[1].includes(":");
      const lengthMatches = key.split("/").length >= url.split("/").length;

      return startsWith && lengthMatches;
    });

    const match = firstSegmentMatches[0];
    const matchSegments = match.split("/");
    const params: Record<string, string> = {};

    for (const segment of matchSegments) {
      if (segment.includes(":")) {
        const idx = matchSegments.indexOf(segment);
        if (url.split("/")[idx]) {
          params[segment.replace(":", "").replace("?", "")] =
            url.split("/")[idx];
        }
      }
    }

    return {
      match,
      params,
    };
  };
}
