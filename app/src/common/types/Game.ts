export interface Game {
  type: "game";
  id: string;
  attributes: {
    hasMessages: boolean;
    hasUserParameterScope: boolean;
  };
}
