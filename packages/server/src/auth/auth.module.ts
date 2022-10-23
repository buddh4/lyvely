import { Module } from '@nestjs/common';
import { JwtAuthService } from './services/jwt-auth.service';
import { LocalStrategy, JwtAccessStrategy, JwtRefreshStrategy } from './guards/strategies';
import { UsersModule } from '../users';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { JwtAuthGuard } from './guards';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/core';
import { ModuleMeta } from '@/core/modules/module.meta';
import { PasswordResetController } from '@/auth/controllers/password-reset.controller';

@Module({
  imports: [
    UsersModule,
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
    JwtAuthGuard,
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
  controllers: [AuthController, PasswordResetController],
  exports: [JwtAuthService, JwtAuthGuard],
})
export class AuthModule {}