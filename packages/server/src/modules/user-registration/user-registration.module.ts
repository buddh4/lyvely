import { Module } from '@nestjs/common';
import { UserRegistrationController } from './controllers/user-registration.controller';
import { ProfilesModule } from '@/modules/profiles';
import { UsersModule } from '@/modules/users';
import { UserRegistrationService } from './services/user-registration.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/modules/app-config';

@Module({
  imports: [
    UsersModule,
    ProfilesModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService<ConfigurationPath>) => ({
        secret: configService.get('auth.jwt.token.secret'),
        signOptions: { expiresIn: configService.get('auth.jwt.token.expiresIn', '1d') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserRegistrationController],
  providers: [UserRegistrationService],
})
export class UserRegistrationModule {}
