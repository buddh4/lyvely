import { CalendarInterval } from '@lyvely/dates';
import { UserAssignmentStrategy } from '@/collab';

export interface ITaskConfig {
  score: number;
  interval: CalendarInterval;
  userStrategy: UserAssignmentStrategy;
}
