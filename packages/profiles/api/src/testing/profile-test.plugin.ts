import { LyvelyTestBuilder, TestPlugin } from '@lyvely/testing';
import { UsersModule } from '@lyvely/users';
import { ProfilesModule } from '../profiles.module';
import { ProfileTestDataUtils } from './profile-test-data.utils';

export function profilesTestPlugin(): TestPlugin {
  return {
    apply(builder: LyvelyTestBuilder) {
      builder.imports([UsersModule, ProfilesModule]);
      builder.providers([ProfileTestDataUtils]);
    },
  };
}
