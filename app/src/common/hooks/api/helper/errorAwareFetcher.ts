import ApiError from "./ApiError";

/**
 * A wrapper for `fetch()` that catches API errors
 *
 * @example
 *  try {
 *    const res = await errorAwareFetcher(() => fetch("/api/test"));
 *  } catch (error) {
 *    // `error` is of type `ApiError`
 *  }
 *
 * @param fetcher The function calling `fetch()`
 * @throws ApiError
 * @returns The response data, parsed as JSON
 */
const errorAwareFetcher = async (fetcher: () => Promise<Response>) => {
  let res;

  try {
    res = await fetcher();
  } catch (error) {
    throw new ApiError((error as Error).message);
  }

  if (!res.ok) {
    throw new ApiError(
      "An error occurred while fetching the data.",
      res.status,
      await res.json()
    );
  }

  return res.json();
};

export default errorAwareFetcher;
