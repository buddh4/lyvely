import { TaskTestDataUtil } from './task-test.utils';
import {
  contentITestPlugin,
  getContentModelDefinition,
  getContentScoreDefinition,
  profilesITestPlugin,
} from '@lyvely/api';
import { Task, TaskSchema, TaskScore, TaskScoreSchema } from '../schemas';

export const taskITestPlugin = {
  apply(builder) {
    builder
      .plugins([profilesITestPlugin, contentITestPlugin])
      .providers([TaskTestDataUtil])
      .models([
        getContentModelDefinition([{ name: Task.name, schema: TaskSchema }]),
        getContentScoreDefinition([{ name: TaskScore.name, schema: TaskScoreSchema }]),
      ]);
  },
};
