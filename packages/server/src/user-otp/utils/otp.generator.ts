import { randomInt } from 'crypto';

const digits = '0123456789';

export function generateOTP(length = 6) {
  return Array.from({ length: length }, () => randomInt(0, digits.length)).join('');
}
