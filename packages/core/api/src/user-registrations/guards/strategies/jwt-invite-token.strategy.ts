import { ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtStrategy, JwtTokenPayloadIF, getIssuedAt } from '@/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/core';
import { UserStatus } from '@lyvely/core-interface';

export const JWT_REGISTRATION_INVITE_TOKEN = 'user-registration-invitation';

@Injectable()
export class JwtInviteTokenStrategy extends JwtStrategy<JwtTokenPayloadIF>({
  name: JWT_REGISTRATION_INVITE_TOKEN,
  options: (configService) => {
    return {
      secretOrKey: configService.get('auth.jwt.verify.secret'),
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
    };
  },
}) {
  constructor(protected configService: ConfigService<ConfigurationPath>) {
    super(configService);
  }

  override async validateUser(user, req, payload) {
    if (user.status !== UserStatus.Active) throw new UnauthorizedException();

    if (user.passwordResetAt && user.passwordResetAt > getIssuedAt(payload)) {
      throw new UnauthorizedException();
    }
  }
}