import { nanoid } from "nanoid";
import { useLocalStorage } from "@rehooks/local-storage";

/**
 * A React hook that ...
 *
 * @returns
 */
const useInstanceId = () => useLocalStorage("instanceId", nanoid())[0];

export default useInstanceId;
