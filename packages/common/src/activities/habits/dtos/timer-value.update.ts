import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { BaseModel } from '@/models';

@Exclude()
export class TimerValueUpdate extends BaseModel<TimerValueUpdate> {
  @Expose()
  @IsNumber()
  value: number;

  constructor(value: number) {
    super({ value });
  }
}
