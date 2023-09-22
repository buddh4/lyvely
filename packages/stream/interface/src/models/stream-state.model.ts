import { BaseModel } from '@lyvely/models';
import { IStreamState } from '../interfaces';
import { IsArray, IsBoolean, IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class StreamState<T extends IStreamState = IStreamState>
  extends BaseModel<T>
  implements IStreamState
{
  @Expose()
  @IsNumber()
  @Min(0)
  @IsOptional()
  head?: number;

  @Expose()
  @IsNumber()
  @Min(0)
  @IsOptional()
  tail?: number;

  @Expose()
  @IsMongoId({ each: true })
  @IsOptional()
  @IsArray()
  tailIds?: Array<string>;

  @Expose()
  @IsMongoId({ each: true })
  @IsOptional()
  @IsArray()
  headIds?: Array<string>;

  @Expose()
  @IsBoolean()
  @IsOptional()
  isEnd?: boolean;
}
