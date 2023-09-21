import { Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Type, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtTokenPayloadIF } from '../interfaces/jwt-payload.interface';
import { ConfigurationPath } from '@lyvely/core';
import { User, UsersService } from '@lyvely/users';
import { UserStatus } from '@lyvely/common';
import { getIssuedAt } from '../utils/jwt.util';

export interface JwtStrategyOptionsIF {
  name: string;
  purpose?: string;
  options: (configService: ConfigService<ConfigurationPath>) => StrategyOptions;
}

abstract class JwtStrategyClass<
  TPayload extends JwtTokenPayloadIF = JwtTokenPayloadIF,
> extends Strategy {
  abstract validateUser(user: User, req: Request, payload: TPayload);
}

export function JwtStrategy<TPayload extends JwtTokenPayloadIF = JwtTokenPayloadIF>(
  options: JwtStrategyOptionsIF,
): abstract new (...args: any[]) => InstanceType<Type<JwtStrategyClass>> {
  options.purpose = options?.purpose || options.name;

  abstract class JwtVerifyMixinStrategy extends PassportStrategy(Strategy, options.name) {
    abstract validateUser(user: User, req: Request, payload: TPayload);

    @Inject()
    protected usersService: UsersService;

    constructor(protected configService: ConfigService<ConfigurationPath>) {
      const defaultStrategyOptions: Partial<StrategyOptions> = {
        issuer: configService.get('auth.jwt.issuer'),
        algorithms: ['HS256', 'RS256'],
        ignoreExpiration: false,
        passReqToCallback: true,
        secretOrKey: configService.get('auth.jwt.verify.secret'),
      };

      super(Object.assign(defaultStrategyOptions, options.options(configService)));
    }

    async validate(req: Request, payload: TPayload) {
      if (payload.purpose !== options.purpose) {
        throw new UnauthorizedException(`Invalid token purpose used as ${options.purpose} token.`);
      }

      const user = await this.usersService.findUserById(payload.sub);

      if (!user || user.status === UserStatus.Disabled) throw new UnauthorizedException();

      const issuedAt = getIssuedAt(payload);
      if (user.sessionResetAt && user.sessionResetAt > issuedAt) throw new UnauthorizedException();

      await this.validateUser(user, req, payload);
      return user;
    }
  }

  return JwtVerifyMixinStrategy;
}
