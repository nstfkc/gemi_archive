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

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}

export type JSONLike =
  | string
  | number
  | boolean
  | null
  | JSONLike[]
  | { [key: string]: JSONLike };

export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  debug?: boolean;
}
