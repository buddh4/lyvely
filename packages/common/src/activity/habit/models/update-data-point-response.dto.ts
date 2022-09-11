import { Exclude, Expose } from 'class-transformer';
import { BaseModel } from '../../../model';
import { IsNumber } from 'class-validator';

@Exclude()
export class UpdateDataPointResultDto extends BaseModel<UpdateDataPointResultDto> {
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
