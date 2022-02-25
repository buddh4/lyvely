import { Module } from '@nestjs/common';
import { TestDataUtils } from './utils/test-data.utils';
import { UsersModule } from '../users/users.module';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    UsersModule,
    ProfilesModule
  ],
  controllers: [],
  providers: [TestDataUtils],
  exports: [TestDataUtils]
})
export class TestModule {}
