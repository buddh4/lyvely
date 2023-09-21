import { Matches } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { REGEX_DATE_FORMAT } from '@lyvely/calendar';

@Exclude()
export class UpdateTaskStateModel {
  @Expose()
  @Matches(REGEX_DATE_FORMAT)
  date: string;

  constructor(obj: Partial<UpdateTaskStateModel>) {
    Object.assign(this, obj);
  }
}
