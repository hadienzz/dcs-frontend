/**
 * Build a stable de-duplication key for a `File` based on the
 * `(name, size, lastModified)` tuple.
 *
 * Two `File` objects sharing the same key are treated as the same logical file
 * for the purposes of `EvidenceUpload`'s append flow (see design.md > Property 8).
 * Tuple parts are joined with `"__"` to avoid collisions with realistic file names.
 *
 * @param file Source `File` instance.
 * @returns Stringified `(name, size, lastModified)` key.
 */
export const getFileDedupKey = (file: File): string =>
  `${file.name}__${file.size}__${file.lastModified}`;

/**
 * Append `incoming` files onto `existing`, dropping any entry whose
 * `(name, size, lastModified)` tuple already appears in the result so far.
 *
 * Behavior:
 * - The first occurrence of each tuple is kept; later duplicates are dropped.
 * - Duplicates within `incoming` itself are also collapsed.
 * - Inputs are not mutated; a new array is returned.
 * - Idempotent: appending the same `incoming` twice yields the same array as
 *   appending it once.
 *
 * @param existing Files already attached.
 * @param incoming Files the user is adding.
 * @returns New array containing `existing` followed by deduplicated `incoming`.
 */
const dedupeFiles = (existing: File[], incoming: File[]): File[] => {
  const seenKeys = new Set<string>(existing.map(getFileDedupKey));
  const filteredIncoming: File[] = [];

  for (const file of incoming) {
    const key = getFileDedupKey(file);
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);
    filteredIncoming.push(file);
  }

  return [...existing, ...filteredIncoming];
};

export default dedupeFiles;
