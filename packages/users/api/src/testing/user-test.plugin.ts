import { LyvelyTestBuilder, TestPlugin } from '@lyvely/testing';
import { UsersModule } from '../users.module';
import { UserTestDataUtils } from './user-test-data.utils';

export function usersTestPlugin(): TestPlugin {
  return {
    apply(builder: LyvelyTestBuilder) {
      builder.imports([UsersModule]);
      builder.providers([UserTestDataUtils]);
    },
  };
}
