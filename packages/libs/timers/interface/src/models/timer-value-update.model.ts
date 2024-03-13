import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { BaseModel } from '@lyvely/common';

@Exclude()
export class TimerValueUpdateModel {
  @Expose()
  @IsNumber()
  value: number;

  constructor(value: number) {
    this.value = value;
  }
}
