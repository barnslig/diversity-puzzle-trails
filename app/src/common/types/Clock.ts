export type ClockState = "running" | "paused";

export interface Clock {
  type: "clock";
  id: "clock";

  attributes: {
    state: ClockState;
    speed: number;
  };
}
