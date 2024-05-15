import { ContentCoreModule } from '../content.module';
import { ITestPlugin } from '@/testing';
import { LiveModule } from '@/live';

export const contentITestPlugin = {
  apply(builder) {
    builder.imports([ContentCoreModule, LiveModule]);
  },
} as ITestPlugin;
