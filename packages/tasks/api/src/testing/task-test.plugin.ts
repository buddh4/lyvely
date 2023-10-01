import { TestPlugin } from '@lyvely/testing';
import { TaskTestDataUtil } from './task-test.utils';
import {
  contentTestPlugin,
  getContentModelDefinition,
  getContentScoreDefinition,
} from '@lyvely/content';
import { Task, TaskSchema, TaskScore, TaskScoreSchema } from '../schemas';
import { profilesTestPlugin } from '@lyvely/profiles';

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
} as TestPlugin;
