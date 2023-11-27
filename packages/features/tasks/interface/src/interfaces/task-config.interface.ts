import { CalendarInterval } from '@lyvely/dates';
import { UserAssignmentStrategy } from '@lyvely/interface';

export interface ITaskConfig {
  score: number;
  interval: CalendarInterval;
  userStrategy: UserAssignmentStrategy;
}
