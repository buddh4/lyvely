import { Expose } from 'class-transformer';
import { BaseModel } from '@/models';
import { IsOptional, IsString } from 'class-validator';
import { IStreamFilter } from '@/stream';

@Expose()
export class ContentStreamFilter extends BaseModel<ContentStreamFilter> implements IStreamFilter {
  @IsString()
  @IsOptional()
  parent?: string;

  reset() {
    // parent filter needs to be reset manually
  }
}
