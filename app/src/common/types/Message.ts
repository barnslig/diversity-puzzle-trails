/**
 * A single message
 */
export interface Message {
  /**
   * Object type
   */
  type: "message";

  /**
   * Unique message ID
   */
  id: string;

  attributes: {
    /**
     * An ISO-8601 time descriptor of when the message was created
     */
    createdAt: string;

    /**
     * The message
     */
    message: string;
  };
}
