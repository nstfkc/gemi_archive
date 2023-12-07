import useSWR, { SWRConfiguration } from "swr";

export function useQuery(
  path: string,
  options: {
    params?: Record<string, string>;
    query?: Record<string, string>;
    config?: SWRConfiguration;
  } = {},
) {
  const { params = {}, query = {}, config = {} } = options;

  let key = path
    .split("/")
    .map((segment) => {
      if (segment.startsWith(":")) {
        const value = params[segment.slice(1)];
        if (!value) {
          throw new Error(`Missing param ${segment.slice(1)}`);
        }
        return value;
      }
      return segment;
    })
    .join("/");

  const queryParams = new URLSearchParams(query);
  if (queryParams.toString()) {
    key += `?${queryParams.toString()}`;
  }
  return useSWR(
    `/api${key}`,
    async (url) => {
      const res = await fetch(url);
      const error = new Error("An error occurred while fetching the data.");
      if (!res.ok) {
        const error = new Error("An error occurred while fetching the data.");
        error.info = (await res.json()).error;
        error.status = res.status;
        throw error;
      }
      const result = await res.json();

      if (result.success) {
        return result.data;
      } else {
        error.info = (await res.json()).error;
        error.status = res.status;
        throw error;
      }
    },
    config,
  );
}
