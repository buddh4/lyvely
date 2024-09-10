import { ContentFilter } from '@lyvely/interface';
import { TaskModel } from './task.model';
import type { IContentSearchQuery } from '@lyvely/interface';

export interface ITaskFilterOptions extends IContentSearchQuery {}

export class TaskFilter extends ContentFilter<TaskModel, ITaskFilterOptions> {}
