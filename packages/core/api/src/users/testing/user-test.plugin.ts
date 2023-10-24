import { LyvelyTestBuilder, TestPlugin } from '@/testing';
import { UsersModule } from '../users.module';
import { UserTestDataUtils } from './user-test-data.utils';

export const usersTestPlugin: TestPlugin = {
  apply(builder: LyvelyTestBuilder) {
    builder.imports([UsersModule]);
    builder.providers([UserTestDataUtils]);
  },
};
