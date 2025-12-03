/**
 * Formats a number of bytes into a human-readable string (B, KB, MB, GB, TB, PB, EB, ZB, YB).
 * @param bytes The number of bytes to format.
 * @param decimals The number of decimal places to include (default: 2).
 * @returns The formatted string (e.g., "1.5 MB").
 */
export const formatSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 B';
  if (bytes < 0) return '0 B'; // Handle negative bytes gracefully

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Clamp index to sizes array bounds
  const index = Math.min(i, sizes.length - 1);

  return parseFloat((bytes / Math.pow(k, index)).toFixed(dm)) + ' ' + sizes[index];
};
