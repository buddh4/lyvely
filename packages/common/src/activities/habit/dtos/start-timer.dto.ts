import { Exclude, Expose } from 'class-transformer';
import { IsInt, Matches, Min } from 'class-validator';
import { REGEX_DATE_FORMAT } from '@/calendar';
import { BaseModel } from '@/models';

@Exclude()
export class StartTimerDto extends BaseModel<StartTimerDto> {
  @Expose()
  @Matches(REGEX_DATE_FORMAT)
  date: string;
}
