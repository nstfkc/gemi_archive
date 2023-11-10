export const views: Record<string, { default: <T>(data: T) => JSX.Element }> =
  import.meta.glob(["@/app/views/**/*", "!**/components/*"], {
    eager: true,
  });
