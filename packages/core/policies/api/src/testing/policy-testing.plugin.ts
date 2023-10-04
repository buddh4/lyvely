import { TestPlugin } from '@lyvely/testing';
import { PoliciesModule } from '../policies.module';

export const policyTestPlugin: TestPlugin = {
  apply(builder) {
    builder.imports([PoliciesModule.forRoot()]);
  },
};
