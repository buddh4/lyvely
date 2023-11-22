import { JwtAuthService, ResetPasswordService } from './services';
import {
  LocalStrategy,
  JwtAccessStrategy,
  JwtRefreshStrategy,
  JwtResetPasswordStrategy,
  JwtAuthGuard,
} from './guards';
import { UsersModule } from '@/users';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController, ResetPasswordController } from './controllers';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/config';
import { CaptchaModule } from '@/captcha';
import { AUTH_MODULE_ID } from '@lyvely/core-interface';
import { LyvelyModule } from '@/core';

@LyvelyModule({
  id: AUTH_MODULE_ID,
  name: 'Auth',
  path: __dirname,
  imports: [
    UsersModule,
    CaptchaModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService<ConfigurationPath>) => ({
        secret: configService.get('auth.jwt.access.secret'),
        signOptions: { expiresIn: configService.get('auth.jwt.access.expiresIn', '15m') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    JwtAuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtResetPasswordStrategy,
    JwtAuthGuard,
    ResetPasswordService,
  ],
  controllers: [AuthController, ResetPasswordController],
  exports: [JwtAuthService, JwtAuthGuard],
})
export class AuthModule {}
