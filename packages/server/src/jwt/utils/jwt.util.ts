import { JwtTokenPayloadIF } from '@/jwt';

export function getIssuedAt(payload: JwtTokenPayloadIF) {
  return new Date(payload.iat * 1000);
}

export function getExpiresAt(payload: JwtTokenPayloadIF) {
  return new Date(payload.exp * 1000);
}
