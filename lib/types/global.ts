type Route =
  | {
      layout: {
        view: string;
        hasLoader: boolean;
      } | null;
      routes: Record<string, Route>;
    }
  | {
      view: string;
      hasLoader: boolean;
    };

export type RouteManifest = Record<string, Route>;
