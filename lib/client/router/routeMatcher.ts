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

    const [, firstSegment, ...urlSegments] = url.split("/");
    console.log({ firstSegment, urlSegments });

    const firstSegmentMatches = routes.filter((key) => {
      // const optionalParamsLength = key
      //   .split("/")
      //   .filter((segment) => segment.includes("?")).length;

      const startsWith = key.startsWith(`/${firstSegment}`);
      const lengthMatches = key.split("/").length >= url.split("/").length;

      console.log(key, { startsWith, lengthMatches });

      return startsWith && lengthMatches;
    });

    const match = firstSegmentMatches[0];
    const matchSegments = match.split("/");
    const params: Record<string, string> = {};

    for (const segment of matchSegments) {
      if (segment.includes(":")) {
        const idx = matchSegments.indexOf(segment);
        if (urlSegments[idx - 2]) {
          params[segment.replace(":", "").replace("?", "")] =
            urlSegments[idx - 2];
        }
      }
    }

    return {
      match,
      params,
    };
  };
}
