import { CalendarInterval } from '@lyvely/calendar';
import { UserAssignmentStrategy } from '@/collab';

export interface ITaskConfig {
  score: number;
  interval: CalendarInterval;
  userStrategy: UserAssignmentStrategy;
}
