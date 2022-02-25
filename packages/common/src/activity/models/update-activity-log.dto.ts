import { Exclude } from 'class-transformer';
import { IsInt, Matches, Min } from 'class-validator';
import { REGEX_DATE_FORMAT } from '../../calendar';

@Exclude()
export class UpdateActivityLogModel {
  @Matches(REGEX_DATE_FORMAT)
  date: string;

  @IsInt()
  @Min(0)
  value: number;

  constructor(obj: Partial<UpdateActivityLogModel>) {
    Object.assign(this, obj);
  }
}