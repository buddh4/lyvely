import { ContentCoreModule } from '../content.module';
import { TestPlugin } from '@/testing';
import { LiveModule } from '@/live';

export const contentTestPlugin = {
  apply(builder) {
    builder.imports([ContentCoreModule, LiveModule]);
  },
} as TestPlugin;
