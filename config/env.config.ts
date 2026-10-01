/**
 * Single place that decides which environment the suite runs against.
 * Override from the shell:  BASE_URL=http://localhost:4201 npm test
 */
export const env = {
  baseURL: process.env.BASE_URL,
  isCI: !!process.env.CI,
} as const;
