import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { BaseModel } from '@/models';

@Exclude()
export class TimerValueUpdateModel extends BaseModel<TimerValueUpdateModel> {
  @Expose()
  @IsNumber()
  value: number;

  constructor(value: number) {
    super({ value });
  }
}
