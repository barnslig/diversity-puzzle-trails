import { ClockState } from "../../types/Clock";
import config from "../../../config";
import useApiUrl from "./useApiUrl";
import useCallApi from "./useCallApi";
import useClock from "./useClock";

/**
 * A React hook that creates a method to update the clock state
 *
 * @returns An array with the loading state at pos 0 and the api method at pos 1
 */
const useUpdateClock = (): [
  boolean,
  (state: ClockState) => Promise<Response | undefined>
] => {
  const { mutate } = useClock();
  const url = useApiUrl((gameId) => config.apiEndpoints.clock(gameId));
  const [isLoading, callApi] = useCallApi(url);

  const updateClock = async (state: ClockState) => {
    try {
      const res = await callApi({
        method: "PATCH",
        body: JSON.stringify({
          data: {
            type: "clock",
            id: "clock",
            attributes: {
              state,
            },
          },
        }),
      });
      mutate();
      return res;
    } catch (err) {}
  };

  return [isLoading, updateClock];
};

export default useUpdateClock;
