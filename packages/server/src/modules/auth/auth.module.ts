import { Module } from '@nestjs/common';
import { JwtAuthService } from './services/jwt-auth.service';
import { LocalStrategy, JwtStrategy, JwtRefreshStrategy } from './strategies';
import { UsersModule } from "../users";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from "../core";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService<ConfigurationPath>) => ({
        secret: configService.get('auth.jwt.access.secret'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService]
    })
  ],
  providers: [
    JwtAuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtAuthGuard
  ],
  controllers: [AuthController],
  exports: [JwtAuthService, JwtAuthGuard],
})
export class AuthModule {}
