/**
 * Safely parses string/number values to BigInt
 */
export function parseBigInt(value: string | number): bigint {
  try {
    return BigInt(value);
  } catch {
    return BigInt(0);
  }
}