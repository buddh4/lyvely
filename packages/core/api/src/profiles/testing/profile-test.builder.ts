import { UserTestBuilder } from '@/users';
import { policyTestPlugin } from '@/policies';
import { LyvelyTestBuilder } from '@/testing';
import { profilesTestPlugin } from './profile-test.plugin';
import { permissionsTestingPlugin } from '@/permissions';

export class ProfileTestBuilder extends UserTestBuilder {
  override init() {
    super.init();
    this.plugins([profilesTestPlugin, policyTestPlugin, permissionsTestingPlugin]);
  }
}

export function buildProfileTest(id: string, init: Partial<LyvelyTestBuilder> = {}) {
  return new ProfileTestBuilder(id, init);
}
