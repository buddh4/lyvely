import { ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtStrategy, JwtTokenPayloadIF } from '@/jwt';
import { User } from '@/users';
import { UserStatus } from '@lyvely/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/core';

export const JWT_RESET_PASSWORD_TOKEN = 'password-reset';

@Injectable()
export class JwtResetPasswordStrategy extends JwtStrategy<JwtTokenPayloadIF>({
  name: JWT_RESET_PASSWORD_TOKEN,
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

  async validateUser(user: User) {
    if (user.status !== UserStatus.Active) {
      throw new UnauthorizedException();
    }
  }
}
