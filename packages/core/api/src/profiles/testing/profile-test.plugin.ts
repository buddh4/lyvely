import { LyvelyTestBuilder, TestPlugin } from '@/testing';
import { UsersModule } from '@/users';
import { ProfilesModule } from '../profiles.module';
import { ProfileTestDataUtils } from './profile-test-data.utils';

export const profilesTestPlugin: TestPlugin = {
  apply(builder: LyvelyTestBuilder) {
    builder.imports([UsersModule, ProfilesModule]);
    builder.providers([ProfileTestDataUtils]);
  },
};
