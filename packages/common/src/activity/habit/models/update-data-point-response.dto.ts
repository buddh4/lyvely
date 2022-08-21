import { Exclude, Expose } from 'class-transformer';
import { BaseDto } from '../../../model';
import { IsNumber } from 'class-validator';

@Exclude()
export class UpdateDataPointResultDto extends BaseDto<UpdateDataPointResultDto> {
  @Expose()
  @IsNumber()
  score: number;

  @Expose()
  @IsNumber()
  value: number;

  @Expose()
  @IsNumber()
  units: number;
}
