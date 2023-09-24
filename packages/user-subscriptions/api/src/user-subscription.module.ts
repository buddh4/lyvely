import { Module } from '@nestjs/common';
import { UserSubscriptionService } from './services';
import { UsersModule } from '@lyvely/users';
import { ProfilesModule } from '@lyvely/profiles';

@Module({
  imports: [UsersModule, ProfilesModule],
  providers: [UserSubscriptionService],
  exports: [UserSubscriptionService],
})
export class UserSubscriptionModule {}
