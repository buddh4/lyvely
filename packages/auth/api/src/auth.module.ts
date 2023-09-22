import { Module } from '@nestjs/common';
import { JwtAuthService, ResetPasswordService } from './services';
import {
  LocalStrategy,
  JwtAccessStrategy,
  JwtRefreshStrategy,
  JwtResetPasswordStrategy,
} from './guards';
import { UsersModule } from '@lyvely/users';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController, ResetPasswordController } from './controllers';
import { JwtAuthGuard } from './guards';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath, ModuleMeta } from '@lyvely/core';
import { CaptchaModule } from '@lyvely/captchas';

@Module({
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
    {
      provide: 'modules.auth.meta',
      useValue: new ModuleMeta({
        id: 'auth',
        path: __dirname,
        name: 'Auth',
        description: 'Lyvely user authentication module',
      }),
    },
  ],
  controllers: [AuthController, ResetPasswordController],
  exports: [JwtAuthService, JwtAuthGuard],
})
export class AuthModule {}
