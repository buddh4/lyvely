import { ContentFilter, IContentFilterOptions } from '@lyvely/interface';
import { TaskModel } from './task.model';

export interface ITaskFilterOptions extends IContentFilterOptions {}

export class TaskFilter extends ContentFilter<TaskModel, ITaskFilterOptions> {}
