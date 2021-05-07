import { createSlice } from "@reduxjs/toolkit";
import { Parameter } from "../../common/types/Parameter";

/**
 * Get an accurate UNIX timestamps, i.e. the SECONDS since 1.1.1970
 * @returns
 */
const now = () => Date.now() / 1000;

interface ParameterState {
  /**
   * User-Specific parameters that are only locally stored
   */
  user: Parameter[];

  /**
   * Global parameters that are synced between all users
   */
  global: Parameter[];

  /**
   * Unix timestamp in seconds of the last tick
   */
  lastUpdated: number;
}

const initialState: ParameterState = {
  user: [
    {
      type: "parameter",
      parameter: "movements",
      value: 2,
      rate: 0.01,
      min: 0,
      max: 10,
    },
  ],

  global: [
    {
      type: "parameter",
      parameter: "energy",
      value: 82,
      rate: -0.0001,
      min: 0,
      max: 99999,
    },
    {
      type: "parameter",
      parameter: "food",
      value: 27,
      rate: -0.0001,
      min: 0,
      max: 99999,
    },
    {
      type: "parameter",
      parameter: "hygiene",
      value: 7,
      rate: 0,
      min: 0,
      max: 99999,
    },
    {
      type: "parameter",
      parameter: "moral",
      value: 7,
      rate: 0,
      min: 0,
      max: 99999,
    },
  ],

  lastUpdated: now(),
};

const parameterSlice = createSlice({
  name: "parameters",

  initialState,

  reducers: {
    /**
     * Update game parameters according to the clock
     */
    tick: (state) => {
      const currentTime = now();

      [...state.user, ...state.global].forEach((param) => {
        if (param.value <= param.min) {
          param.value = param.min;
        } else if (param.value >= param.max) {
          param.value = param.max;
        } else {
          const delta = currentTime - state.lastUpdated;
          param.value = param.value + param.rate * delta;
        }
      });

      state.lastUpdated = currentTime;
    },
  },
});

export const { tick } = parameterSlice.actions;

export default parameterSlice.reducer;
