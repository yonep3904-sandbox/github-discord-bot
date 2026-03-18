export * from '@/utils/string_checker';

export const required = (name: string): string => {
  const v = process.env[name];
  if (v === undefined) throw new Error(`Missing env: ${name}`);
  return v;
};

export const optional = (name: string, defaultValue: string): string => {
  const v = process.env[name];
  return v ?? defaultValue;
};
