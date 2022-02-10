/**
 * @file CLI utility to extract and merge formatjs messages with existing language files
 */
import { extract } from "@formatjs/cli";
import fg from "fast-glob";
import fs from "fs/promises";

/**
 * Files from which messages are extracted
 */
const filePatterns = "src/**/*.ts*";

/**
 * Extraction options
 */
const extractOptions = {
  idInterpolationPattern: "[sha512:contenthash:base64:6]",
  throws: false,
  readFromStdin: false,
  flatten: false,
};

const init = async () => {
  /**
   * Array of files from which messages should be extracted
   */
  const files = await fg(filePatterns);

  /**
   * Extracted formatjs messages
   */
  const extracted = JSON.parse(await extract(files, extractOptions));

  await Promise.all(
    // Each console argument is expected to be a pre-existing language file
    process.argv.slice(2).map(async (argv) => {
      const contents = await fs.readFile(argv, {
        encoding: "utf8",
      });
      const parsedContents = JSON.parse(contents);

      /* Merge strategy: We only consider keys of freshly extracted
       * messages. For each key, we prefer the value from the pre-existing
       * language files, keeping already done translations. For new keys,
       * we take the default message.
       *
       * This merge strategy results in messages being dropped from the
       * translation files as soon as they are no longer used in code.
       */
      const merged = {};
      for (const key in extracted) {
        merged[key] = parsedContents[key] || extracted[key];
      }

      const mergedJson = JSON.stringify(merged, null, 2);
      await fs.writeFile(argv, mergedJson + "\n");
    })
  );
};

init();
