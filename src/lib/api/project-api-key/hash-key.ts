import { randomBytes, createHash, timingSafeEqual } from 'crypto';

const KEY_PREFIX = 'cgo_live_';
const PREFIX_DISPLAY_LENGTH = 12;

export interface GeneratedApiKey {
  raw: string;
  prefix: string;
  hash: string;
}

export function generateApiKey(): GeneratedApiKey {
  const secret = randomBytes(24).toString('base64url');
  const raw = `${KEY_PREFIX}${secret}`;
  const prefix = raw.slice(0, KEY_PREFIX.length + PREFIX_DISPLAY_LENGTH);
  const hash = createHash('sha256').update(raw).digest('hex');
  return { raw, prefix, hash };
}

export function hashApiKey(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

export function extractKeyPrefix(raw: string): string {
  return raw.slice(0, KEY_PREFIX.length + PREFIX_DISPLAY_LENGTH);
}

export function verifyApiKey(raw: string, hash: string): boolean {
  const candidate = Buffer.from(hashApiKey(raw));
  const expected = Buffer.from(hash);
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}
