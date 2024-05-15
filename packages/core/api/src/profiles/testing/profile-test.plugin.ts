import { TestBuilder, ITestPlugin } from '@/testing';
import { ProfilesModule } from '../profiles.module';
import { ProfileTestDataUtils } from './profile-test-data.utils';

export const profilesITestPlugin: ITestPlugin = {
  apply(builder: TestBuilder) {
    builder.imports([ProfilesModule]);
    builder.providers([ProfileTestDataUtils]);
  },
};
