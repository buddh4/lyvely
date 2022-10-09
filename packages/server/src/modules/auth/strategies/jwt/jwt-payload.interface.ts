export const PURPOSE_ACCESS_TOKEN = 'access_token';
export const PURPOSE_REFRESH_TOKEN = 'refresh_token';

export interface JwtTokenPayloadIF {
  purpose?: string;
}

export interface JwtAccessTokenPayloadIF extends JwtTokenPayloadIF {
  sub: string;
}

export interface JwtRefreshTokenPayloadIF extends JwtTokenPayloadIF {
  sub: string;
}
