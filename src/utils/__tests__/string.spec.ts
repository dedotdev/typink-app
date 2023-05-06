import { trimTrailingSlash } from '@/utils/string';

describe('trimTrailingSlash', () => {
  it.each([
    { input: 'https://hello.com', expected: 'https://hello.com' },
    { input: 'https://hello.com/', expected: 'https://hello.com' },
    { input: 'https://hello.com///', expected: 'https://hello.com' },
  ])('trimTrailingSlash($input) -> $expected', ({ input, expected }) => {
    expect(trimTrailingSlash(input)).toEqual(expected);
  });
});
