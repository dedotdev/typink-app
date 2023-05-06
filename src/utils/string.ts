export const trimTrailingSlash = (input: string): string => {
  return input.endsWith('/') ? trimTrailingSlash(input.slice(0, -1)) : input;
};
