import { Module } from '@nestjs/common';
import { JwtAuthService } from './services/jwt-auth.service';
import { LocalStrategy, JwtAccessStrategy, JwtRefreshStrategy } from './guards/strategies';
import { UsersModule } from '../users';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { JwtAuthGuard } from './guards';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/modules/core';
import { ModuleMeta } from '@/modules/core/modules/module.meta';
import { UserOtpService } from '@/modules/auth/services/user-otp.service';
import { UserOtp, UserOtpSchema } from '@/modules/auth/schemas/user-otp.schema';
import { UserOtpDao } from '@/modules/auth/daos/user-otp.dao';
import { MongooseModule } from '@nestjs/mongoose';

const UserOtpModel = MongooseModule.forFeature([{ name: UserOtp.name, schema: UserOtpSchema }]);

@Module({
  imports: [
    UsersModule,
    PassportModule,
    UserOtpModel,
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
    UserOtpService,
    UserOtpDao,
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
  controllers: [AuthController],
  exports: [JwtAuthService, UserOtpService, JwtAuthGuard],
})
export class AuthModule {}
