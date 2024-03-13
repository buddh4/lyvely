import { IStreamState } from '../interfaces';
import { IsArray, IsBoolean, IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { BaseModel } from '@lyvely/common';

@Exclude()
export class StreamState implements IStreamState {
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

  constructor(data: StreamState) {
    BaseModel.init(this, data);
  }
}
