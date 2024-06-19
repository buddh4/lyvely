import { JwtAuthService, ResetPasswordService } from './services';
import {
  LocalStrategy,
  JwtAccessStrategy,
  JwtRefreshStrategy,
  JwtResetPasswordStrategy,
  RootAuthGuard,
} from './guards';
import { UsersModule } from '@/users';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController, ResetPasswordController } from './controllers';
import { LyvelyConfigService } from '@/config';
import { CaptchaModule } from '@/captcha';
import { AUTH_MODULE_ID } from '@lyvely/interface';
import { type AuthModuleConfig, LyvelyModule } from '@/core';

@LyvelyModule({
  id: AUTH_MODULE_ID,
  name: 'Auth',
  path: __dirname,
  imports: [
    UsersModule,
    CaptchaModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: LyvelyConfigService<AuthModuleConfig>) => ({
        secret: configService.getModuleConfigOrThrow('auth', 'jwt.access.secret'),
        signOptions: {
          expiresIn: configService.getModuleConfig('auth', 'jwt.access.expiresIn', '15m'),
        },
      }),
      inject: [LyvelyConfigService],
    }),
  ],
  providers: [
    JwtAuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtResetPasswordStrategy,
    RootAuthGuard,
    ResetPasswordService,
  ],
  controllers: [AuthController, ResetPasswordController],
  exports: [JwtAuthService, RootAuthGuard],
})
export class AuthModule {}
