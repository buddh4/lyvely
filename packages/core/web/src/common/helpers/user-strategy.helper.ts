import { UserAssignmentStrategy } from '@lyvely/interface';
import { ISelectOptions } from '@lyvely/ui';

export function getUserStrategyOptions(): ISelectOptions {
  return [
    { value: UserAssignmentStrategy.Shared, label: `common.user-strategy.shared` },
    { value: UserAssignmentStrategy.PerUser, label: `common.user-strategy.per-user` },
  ];
}
