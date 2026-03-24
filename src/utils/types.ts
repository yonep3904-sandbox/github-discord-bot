/**
 * Gets the property of an object if it exists and is of the correct type.
 * @param obj The object to get the property from.
 * @param key The key of the property to get.
 * @returns The value of the property if it exists and is of the correct type, otherwise undefined.
 */
export function getProperty<
  T extends Record<string, unknown>,
  K extends keyof T,
>(obj: unknown, key: K): T[K] | undefined {
  if (
    typeof obj === 'object' &&
    obj !== null &&
    Object.prototype.hasOwnProperty.call(obj, key)
  ) {
    return (obj as T)[key];
  }
  return undefined;
}
