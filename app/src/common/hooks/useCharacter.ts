import { useLocalStorage } from "@rehooks/local-storage";

/**
 * A React hook that stores the character in a way that it survives page reloads
 *
 * @returns An array with the current character at pos 0, a function to set it at pos 1 and a function to delete it at position 2
 */
const useCharacter = () => useLocalStorage("character");

export default useCharacter;
