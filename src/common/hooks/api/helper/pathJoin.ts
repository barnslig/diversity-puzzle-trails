/**
 * Join all given path segments together and normalize them
 *
 * @param segments A sequence of path segments
 * @returns The joined, normalized path
 */
const pathJoin = (...segments: string[]) =>
  segments
    .map((segment) => segment.replace(/^\/+/, "").replace(/\/+$/, ""))
    .join("/")
    .replace(/\/+/, "/");

export default pathJoin;
