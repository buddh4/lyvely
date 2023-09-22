import { BaseModel } from '@lyvely/models';
import { IStreamFilter, IStreamRequest, IStreamState } from '../interfaces';
import { StreamState } from './stream-state.model';
import { Expose, Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

@Expose()
export class StreamRequest<
    TFilter extends IStreamFilter = any,
    TState extends IStreamState = IStreamState,
  >
  extends BaseModel<StreamRequest<TFilter, TState>>
  implements IStreamRequest<TFilter, TState>
{
  @Type(() => StreamState)
  state?: TState;

  @IsNumber()
  @Min(1)
  batchSize: number;

  @Expose()
  filter?: TFilter;

  isInitialRequest() {
    return !this.state?.headIds;
  }
}
