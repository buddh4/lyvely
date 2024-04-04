import { TestBuilder, TestPlugin } from '@/testing';
import { UsersModule } from '../users.module';
import { UserTestDataUtils } from './user-test-data.utils';
import { FilesModule } from '@/files/files.module';

export const usersTestPlugin: TestPlugin = {
  apply(builder: TestBuilder) {
    builder.imports([UsersModule, FilesModule]);
    builder.providers([UserTestDataUtils]);
  },
};
