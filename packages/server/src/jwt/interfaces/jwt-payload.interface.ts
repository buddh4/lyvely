export const PURPOSE_ACCESS_TOKEN = 'access_token';

export const PURPOSE_VERIFY_TOKEN = 'verify_token';

export interface JwtTokenPayloadIF {
  sub: string;
  purpose?: string;
  iat: number;
  exp: number;
}
