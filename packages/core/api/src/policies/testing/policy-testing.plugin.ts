import { ITestPlugin } from '@/testing';
import { PoliciesModule } from '../policies.module';

export const policyITestPlugin: ITestPlugin = {
  apply(builder) {
    builder.imports([PoliciesModule.forRoot()]);
  },
};
