import { BaseModel, type PropertiesOf, PropertyType } from '@lyvely/common';
import { IStreamFilter, IStreamRequest, IStreamState } from '../interfaces';
import { StreamState } from './stream-state.model';
import { Expose } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

@Expose()
export class StreamRequest<
  TFilter extends IStreamFilter = any,
  TState extends IStreamState = IStreamState,
> implements IStreamRequest<TFilter, TState>
{
  @PropertyType(StreamState, { optional: true })
  state?: TState;

  @IsNumber()
  @Min(1)
  batchSize: number;

  @Expose()
  filter?: TFilter;

  constructor(data: PropertiesOf<StreamRequest<TFilter, TState>>) {
    BaseModel.init(this, data);
  }

  isInitialRequest() {
    return !this.state?.headIds;
  }
}
