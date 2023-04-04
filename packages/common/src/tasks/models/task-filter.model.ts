import { ContentFilter, IContentFilterOptions } from '@/content';
import { TaskModel } from './task.model';

export interface ITaskFilterOptions extends IContentFilterOptions {}

export class TaskFilter extends ContentFilter<TaskModel, ITaskFilterOptions> {}
