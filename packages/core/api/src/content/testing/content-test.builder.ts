import { ProfileTestBuilder } from '@/profiles';
import { contentITestPlugin } from './content-test.plugin';

export class ContentTestBuilder extends ProfileTestBuilder {
  override init() {
    super.init();
    this.plugins([contentITestPlugin]);
  }
}

export function buildContentTest(id: string) {
  return new ContentTestBuilder(id);
}
