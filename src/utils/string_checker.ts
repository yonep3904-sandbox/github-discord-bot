export const numberCheck = (
  v: string,
  min: number | null,
  max: number | null,
): number => {
  const n = Number(v);
  if (!isNaN(n)) {
    if (min !== null && n < min) {
      throw new Error(`Number env ${v} is less than ${min}`);
    }
    if (max !== null && n > max) {
      throw new Error(`Number env ${v} is greater than ${max}`);
    }
    return n;
  }
  throw new Error(`Invalid number env: ${v}`);
};

export const integerCheck = (
  v: string,
  min: number | null,
  max: number | null,
): number => {
  const n = Number(v);
  if (Number.isInteger(n)) {
    if (min !== null && n < min) {
      throw new Error(`Integer env ${v} is less than ${min}`);
    }
    if (max !== null && n > max) {
      throw new Error(`Integer env ${v} is greater than ${max}`);
    }
    return n;
  }
  throw new Error(`Invalid integer env: ${v}`);
};

export const booleanCheck = (
  v: string,
  trueValue: string = 'true',
  falseValue: string = 'false',
): boolean => {
  if (v === trueValue) return true;
  if (v === falseValue) return false;
  throw new Error(`Invalid boolean env: ${v}`);
};

export const stringCheck = (
  v: string,
  format: RegExp | null = null,
): string => {
  if (format === null || format.test(v)) return v;
  throw new Error(`Invalid env format: ${v}`);
};

export const urlCheck = (v: string): string => {
  try {
    new URL(v);
    return v;
  } catch {
    throw new Error(`Invalid URL env: ${v}`);
  }
};

export const enumCheck = <T extends string>(
  v: string,
  validValues: readonly T[],
): T => {
  if (validValues.includes(v as T)) return v as T;
  throw new Error(
    `Invalid enum env: ${v}. Valid values are: ${validValues.join(', ')}`,
  );
};
