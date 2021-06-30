/**
 * All available game parameter types
 */
export type ParameterType =
  | "movements"
  | "energy"
  | "food"
  | "hygiene"
  | "moral";

/**
 * All available game parameter scopes
 */
export type ParameterScope = "global" | "user";

/**
 * A single game parameter, e.g. remaining food
 */
export interface Parameter {
  /**
   * Object type
   */
  type: "parameter";

  /**
   * Type of the game parameter
   */
  id: ParameterType;

  attributes: {
    /**
     * Whether the game parameter is globally valid or only for the current user
     */
    scope: ParameterScope;

    /**
     * Current integer parameter value, e.g. 7
     */
    value: number;

    /**
     * Change per second, e.g. -0.001, 0 or 0.1
     */
    rate: number;

    /**
     * Minimum value, e.g. 0 or -999999
     */
    min: number;

    /**
     * Maximum value. e.g. 100 or 999999
     */
    max: number;
  };
}
