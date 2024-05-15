import {
  ITestPlugin,
  contentITestPlugin,
  getContentModelDefinition,
  profilesITestPlugin,
} from '@lyvely/api';
import { Chart, ChartSchema } from '../schemas';

export const analyticsITestPlugin = {
  apply(builder) {
    builder
      .plugins([contentITestPlugin, profilesITestPlugin])
      .models([getContentModelDefinition([{ name: Chart.name, schema: ChartSchema }])]);
  },
} as ITestPlugin;
