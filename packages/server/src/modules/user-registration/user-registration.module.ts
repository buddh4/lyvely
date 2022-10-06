import { Module } from '@nestjs/common';
import { UserRegistrationController } from './controllers/user-registration.controller';
import { ProfilesModule } from '../profiles';
import { UsersModule } from '../users';
import { UserRegistrationService } from './services/user-registration.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/modules/core';

@Module({
  imports: [
    UsersModule,
    ProfilesModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService<ConfigurationPath>) => ({
        secret: configService.get('auth.jwt.token.secret'),
        signOptions: { expiresIn: configService.get('auth.jwt.token.expiration', '1d') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserRegistrationController],
  providers: [UserRegistrationService],
})
export class UserRegistrationModule {}
