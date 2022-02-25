import { Exclude, Expose, Transform } from 'class-transformer';
import { BaseDto } from '../../model';
import { IProfileRelation } from '../interfaces';

@Exclude()
export class ProfileRelationDto<T = any> extends BaseDto<T & { pid: any }> implements IProfileRelation {
  @Expose()
  @Transform(({value, obj}) => obj.pid?.toString() || value)
  pid: string;

  @Expose()
  type: string;
}