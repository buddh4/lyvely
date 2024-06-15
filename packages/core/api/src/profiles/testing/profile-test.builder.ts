import { UserTestBuilder } from '@/users';
import { policyITestPlugin } from '@/policies';
import { profilesITestPlugin } from './profile-test.plugin';
import { permissionsTestingPlugin } from '@/permissions';

export class ProfileTestBuilder extends UserTestBuilder {
  override init() {
    super.init();
    this.plugins([profilesITestPlugin, policyITestPlugin, permissionsTestingPlugin]);
  }
}

export function buildProfileTest(id: string) {
  return new ProfileTestBuilder(id);
}
