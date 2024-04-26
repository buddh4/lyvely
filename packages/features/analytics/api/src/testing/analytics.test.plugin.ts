import {
  TestPlugin,
  contentTestPlugin,
  getContentModelDefinition,
  profilesTestPlugin,
} from '@lyvely/api';
import { Chart, ChartSchema } from '../schemas';

export const analyticsTestPlugin = {
  apply(builder) {
    builder
      .plugins([contentTestPlugin, profilesTestPlugin])
      .models([getContentModelDefinition([{ name: Chart.name, schema: ChartSchema }])]);
  },
} as TestPlugin;
