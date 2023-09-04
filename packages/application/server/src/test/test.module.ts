import { Module } from '@nestjs/common';
import { TestDataUtils } from './utils/test-data.utils';
import { UsersModule } from '../users';
import { ProfilesModule } from '../profiles';

@Module({
  imports: [UsersModule, ProfilesModule],
  controllers: [],
  providers: [TestDataUtils],
  exports: [TestDataUtils],
})
export class TestModule {}
