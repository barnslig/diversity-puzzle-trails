import { BarChart, ChatBubble, Person } from "@material-ui/icons";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import {
  CodeActionChangeParameter,
  CodeActionSendMessage,
  CodeActionSetCharacter,
} from "../../common/types/Code";
import parameterMap from "../parameters/parameterMap";

type CodeActionMapping = {
  icon: React.ReactNode;
  label: (action: any) => React.ReactNode;
  value: (action: any) => React.ReactNode;
};

type CodeActionTypes =
  | "changeParameter"
  | "setCharacter"
  | "getInformation"
  | "sendMessage";

type CodeActionMap = {
  [K in CodeActionTypes]: CodeActionMapping;
};

const codeActionMap: CodeActionMap = {
  changeParameter: {
    icon: <BarChart />,
    label: ({ parameter }: CodeActionChangeParameter) =>
      parameterMap[parameter].label,
    value: ({ add }: CodeActionChangeParameter) =>
      `${add > 0 ? "+" : ""}${add}`,
  },
  setCharacter: {
    icon: <Person />,
    label: () => (
      <FormattedMessage
        defaultMessage="Setze Charakter"
        description="qr code action label"
      />
    ),
    value: ({ character }: CodeActionSetCharacter) => character,
  },
  getInformation: {
    icon: null,
    label: () => null,
    value: () => null,
  },
  sendMessage: {
    icon: <ChatBubble />,
    label: () => (
      <FormattedMessage
        defaultMessage="Sende Nachricht"
        description="qr code action label"
      />
    ),
    value: ({ message }: CodeActionSendMessage) => message,
  },
};

export default codeActionMap;
