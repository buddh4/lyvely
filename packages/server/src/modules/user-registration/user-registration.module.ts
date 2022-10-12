import { Module } from '@nestjs/common';
import { UserRegistrationController } from './controllers/user-registration.controller';
import { ProfilesModule } from '@/modules/profiles';
import { UsersModule } from '@/modules/users';
import { UserRegistrationService } from './services/user-registration.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/modules/core';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProfilesModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService<ConfigurationPath>) => ({
        secret: configService.get('auth.jwt.verify.secret'),
        signOptions: { expiresIn: configService.get('auth.jwt.verify.expiresIn', '1d') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserRegistrationController],
  providers: [UserRegistrationService],
})
export class UserRegistrationModule {}
