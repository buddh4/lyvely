import { ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtStrategy, JwtTokenPayloadIF, getIssuedAt } from '@/jwt';
import { LyvelyConfigService } from '@/config';

export const JWT_REGISTRATION_INVITE_TOKEN = 'user-registration-invitation';

@Injectable()
export class JwtInviteTokenStrategy extends JwtStrategy<JwtTokenPayloadIF>({
  name: JWT_REGISTRATION_INVITE_TOKEN,
  options: (configService) => {
    return {
      secretOrKey: configService.getModuleConfig('auth', 'jwt.verify.secret'),
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
    };
  },
}) {
  constructor(protected configService: LyvelyConfigService) {
    super(configService);
  }

  override async validateUser(user, req, payload) {
    if (user.passwordResetAt && user.passwordResetAt > getIssuedAt(payload)) {
      throw new UnauthorizedException();
    }
  }
}
