import { TestPlugin } from '@lyvely/testing';
import { TaskTestDataUtil } from './task-test.utils';
import { getContentModelDefinition, getContentScoreDefinition } from '@lyvely/content';
import { Task, TaskSchema, TaskScore, TaskScoreSchema } from '../schemas';

export const taskTestPlugin = {
  apply(builder) {
    builder
      .providers([TaskTestDataUtil])
      .models([
        getContentModelDefinition([{ name: Task.name, schema: TaskSchema }]),
        getContentScoreDefinition([{ name: TaskScore.name, schema: TaskScoreSchema }]),
      ]);
  },
} as TestPlugin;
