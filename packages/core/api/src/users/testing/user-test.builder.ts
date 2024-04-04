import { LyvelyTestBuilder } from '@/testing';
import { usersTestPlugin } from './user-test.plugin';

export class UserTestBuilder extends LyvelyTestBuilder {
  override init() {
    super.init();
    this.plugins([usersTestPlugin]);
  }
}

export function buildUserTest(id: string, init: Partial<LyvelyTestBuilder> = {}) {
  return new UserTestBuilder(id, init);
}
