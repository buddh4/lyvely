import { UserTestBuilder } from '@/users';
import { policyITestPlugin } from '@/policies';
import { LyvelyTestBuilder } from '@/testing';
import { profilesITestPlugin } from './profile-test.plugin';
import { permissionsTestingPlugin } from '@/permissions';

export class ProfileTestBuilder extends UserTestBuilder {
  override init() {
    super.init();
    this.plugins([profilesITestPlugin, policyITestPlugin, permissionsTestingPlugin]);
  }
}

export function buildProfileTest(id: string, init: Partial<LyvelyTestBuilder> = {}) {
  return new ProfileTestBuilder(id, init);
}
