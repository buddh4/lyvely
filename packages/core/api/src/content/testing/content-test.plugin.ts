import { ContentCoreModule } from '../content.module';
import { TestPlugin } from '@/testing';

export const contentTestPlugin = {
  apply(builder) {
    builder.imports([ContentCoreModule]);
  },
} as TestPlugin;
