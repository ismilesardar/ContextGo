export const TRUSTED_ORIGINS = [
  process.env.NEXT_PUBLIC_BASE_URL,
  'http://localhost:3000'
].filter(Boolean) as string[];
