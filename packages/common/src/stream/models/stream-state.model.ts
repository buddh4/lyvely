import { BaseModel } from '@/models';
import { IStreamState } from '@/stream';
import { IsBoolean, IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class StreamState<T extends IStreamState = IStreamState> extends BaseModel<T> implements IStreamState {
  @Expose()
  @IsNumber()
  @Min(0)
  @IsOptional()
  firstOrder?: number;

  @Expose()
  @IsNumber()
  @Min(0)
  @IsOptional()
  lastOrder?: number;

  @Expose()
  @IsMongoId()
  @IsOptional()
  lastId?: string;

  @Expose()
  @IsMongoId()
  @IsOptional()
  firstId?: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  isEnd?: boolean;
}
