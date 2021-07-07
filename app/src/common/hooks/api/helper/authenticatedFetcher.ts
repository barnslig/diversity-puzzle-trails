import errorAwareFetcher from "./errorAwareFetcher";

/**
 * A SWR fetcher that adds an Authorization header to the request
 *
 * @param url The URL to fetch
 * @param bearer The HTTP Bearer Token
 * @returns A SWR fetcher
 */
const authenticatedFetcher = async (url: string, bearer: string) => {
  return errorAwareFetcher(() =>
    fetch(url, {
      headers: {
        Authorization: `Bearer ${bearer}`,
      },
    })
  );
};

export default authenticatedFetcher;
