import { Exclude } from 'class-transformer';

import { UpdateDataPointModel } from '@/time-series';

@Exclude()
export class UpdateHabitDataPointModel extends UpdateDataPointModel {}
