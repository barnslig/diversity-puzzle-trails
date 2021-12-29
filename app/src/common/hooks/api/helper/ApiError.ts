export type ApiErrorResponseTypes =
  | "already-used"
  | "code-not-found"
  | "game-not-found"
  | "not-authorised"
  | "unknown-error";

export interface ApiErrorResponseError {
  id: ApiErrorResponseTypes;
  status: number;
  title: string;
}

export interface ApiErrorResponse {
  errors: ApiErrorResponseError[];
}

/**
 * A custom error class that is thrown when an API returns an error
 */
class ApiError extends Error {
  status?: number;
  info?: ApiErrorResponse;

  constructor(
    message: string,
    status?: number,
    info?: ApiErrorResponse,
    ...params: any[]
  ) {
    super(...params);

    this.message = message;
    this.name = "ApiError";
    this.status = status;
    this.info = info;
  }
}

export default ApiError;
