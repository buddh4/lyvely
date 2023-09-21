import { Exclude } from 'class-transformer';

import { UpdateDataPointModel } from '@lyvely/time-series';

@Exclude()
export class UpdateHabitDataPointModel extends UpdateDataPointModel {}
