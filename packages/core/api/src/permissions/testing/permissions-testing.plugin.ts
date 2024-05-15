import { ITestPlugin } from '@/testing';
import { PermissionsModule } from '@/permissions/permissions.module';

export const permissionsTestingPlugin: ITestPlugin = {
  apply(builder) {
    builder.imports([PermissionsModule]);
  },
};
