import { BaseModel } from '@/models';
import { IStreamFilter, IStreamRequest, IStreamState, StreamState } from '@/stream';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

@Exclude()
export class StreamRequest<TFilter extends IStreamFilter = any, TState extends IStreamState = IStreamState>
  extends BaseModel<StreamRequest<TFilter, TState>>
  implements IStreamRequest<TFilter, TState>
{
  @Expose()
  @Type(() => StreamState)
  state?: TState;

  @IsNumber()
  @Min(1)
  batchSize: number;

  @Expose()
  filter?: TFilter;
}
