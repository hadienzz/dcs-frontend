/**
 * Format a file size in bytes into a human-readable string.
 *
 * Rules (mirrors design.md > Property 10):
 * - Returns `"<n> KB"` when `bytes < 1_048_576`, otherwise `"<n> MB"`.
 * - `n` is rounded to at most one decimal place. A trailing `.0` is dropped
 *   (e.g. `1024` → `"1 KB"`, not `"1.0 KB"`).
 * - Negative or non-finite `bytes` are clamped to `0`, which renders as `"0 KB"`.
 *
 * @param bytes Size in bytes.
 * @returns Formatted size string in KB or MB.
 */
const formatFileSize = (bytes: number): string => {
  const safeBytes = Number.isFinite(bytes) && bytes > 0 ? bytes : 0;
  const ONE_MB = 1_048_576;
  const ONE_KB = 1024;

  if (safeBytes < ONE_MB) {
    return `${roundToOneDecimal(safeBytes / ONE_KB)} KB`;
  }

  return `${roundToOneDecimal(safeBytes / ONE_MB)} MB`;
};

const roundToOneDecimal = (value: number): string => {
  const rounded = Math.round(value * 10) / 10;
  return rounded.toString();
};

export default formatFileSize;
