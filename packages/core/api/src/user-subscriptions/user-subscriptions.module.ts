import { Module } from '@nestjs/common';
import { UserSubscriptionService } from './services';
import { UsersModule } from '@/users';
import { ProfilesModule } from '@/profiles';

@Module({
  imports: [UsersModule, ProfilesModule],
  providers: [UserSubscriptionService],
  exports: [UserSubscriptionService],
})
export class UserSubscriptionsModule {}
