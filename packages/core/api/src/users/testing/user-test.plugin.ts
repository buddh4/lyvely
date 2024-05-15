import { TestBuilder, ITestPlugin } from '@/testing';
import { UsersModule } from '../users.module';
import { UserTestDataUtils } from './user-test-data.utils';
import { FilesModule } from '@/files/files.module';

export const usersITestPlugin: ITestPlugin = {
  apply(builder: TestBuilder) {
    builder.imports([UsersModule, FilesModule]);
    builder.providers([UserTestDataUtils]);
  },
};
