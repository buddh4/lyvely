import { Exclude } from 'class-transformer';

import { UpdateDataPointModel } from '@lyvely/time-series-interface';

@Exclude()
export class UpdateHabitDataPointModel extends UpdateDataPointModel {}
