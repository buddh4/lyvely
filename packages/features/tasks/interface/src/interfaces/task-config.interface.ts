import { CalendarInterval } from '@lyvely/dates';
import { UserAssignmentStrategy } from '@lyvely/common';

export interface ITaskConfig {
  score: number;
  interval: CalendarInterval;
  userStrategy: UserAssignmentStrategy;
}
