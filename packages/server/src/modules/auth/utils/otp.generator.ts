import crypto from 'crypto';

const digits = '0123456789';

export function generateOTP(length = 6) {
  return Array.from({ length: length }, () => crypto.randomInt(0, digits.length)).join('');
}
