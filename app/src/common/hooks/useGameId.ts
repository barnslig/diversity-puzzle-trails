import { useLocalStorage } from "@rehooks/local-storage";

/**
 * A React hook that stores the game ID in a way that it survives page reloads
 *
 * @returns An array with the current game id at pos 0, a function to set it at pos 1 and a function to delete it at position 2
 */
const useGameId = () => useLocalStorage("gameId");

export default useGameId;
