/**
 * Join all given path segments together and normalize them
 *
 * @param segments A sequence of path segments
 * @returns The joined, normalized path
 */
export const pathJoin = (...segments: string[]) =>
  segments
    .map((segment) => segment.replace(/^\/+/, "").replace(/\/+$/, ""))
    .join("/");

/**
 * A SWR fetcher that adds an Authorization header to the request
 *
 * @param url The URL to fetch
 * @param bearer The HTTP Bearer Token
 * @returns A SWR fetcher
 */
export const authenticatedFetcher = (url: string, bearer: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${bearer}`,
    },
  }).then((res) => res.json());
