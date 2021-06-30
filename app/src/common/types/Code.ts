import { ParameterType } from "./Parameter";

export interface CodeActionChangeParameter {
  type: "changeParameter";

  /** Parameter to change */
  parameter: ParameterType;

  /** Value which should be added/subtracted from the parameter, e.g. -2, 0 or 1 */
  add: number;
}

export interface CodeActionSetCharacter {
  type: "setCharacter";

  /** Character to set */
  character: string;
}

export interface CodeActionGetInformation {
  type: "getInformation";
}

export interface CodeActionSendMessage {
  type: "sendMessage";

  /** Message that is sent to everyone */
  message: string;
}

export type CodeAction =
  | CodeActionChangeParameter
  | CodeActionSetCharacter
  | CodeActionGetInformation
  | CodeActionSendMessage;

/**
 * A QR code containing different game actions
 */
export interface Code {
  /** QR code type, should be "code" */
  type: "code";

  /** Unique ID of the code */
  id: string;

  attributes: {
    /** Whether the code with this uid can only be executed once through the game */
    oneShot: boolean;

    /** Actions that this code triggers */
    actions: CodeAction[];
  };
}
