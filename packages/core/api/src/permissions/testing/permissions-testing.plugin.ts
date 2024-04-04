import { TestPlugin } from '@/testing';
import { PermissionsModule } from '@/permissions/permissions.module';

export const permissionsTestingPlugin: TestPlugin = {
  apply(builder) {
    builder.imports([PermissionsModule]);
  },
};
