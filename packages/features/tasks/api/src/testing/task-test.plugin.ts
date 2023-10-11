import { TaskTestDataUtil } from './task-test.utils';
import {
  contentTestPlugin,
  getContentModelDefinition,
  getContentScoreDefinition,
  profilesTestPlugin,
} from '@lyvely/core';
import { Task, TaskSchema, TaskScore, TaskScoreSchema } from '../schemas';

export const taskTestPlugin = {
  apply(builder) {
    builder
      .plugins([profilesTestPlugin, contentTestPlugin])
      .providers([TaskTestDataUtil])
      .models([
        getContentModelDefinition([{ name: Task.name, schema: TaskSchema }]),
        getContentScoreDefinition([{ name: TaskScore.name, schema: TaskScoreSchema }]),
      ]);
  },
};
