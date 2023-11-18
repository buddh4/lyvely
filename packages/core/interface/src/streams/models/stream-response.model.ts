import { BaseModel, PropertyType } from '@lyvely/common';
import { IStreamResponse, IStreamState } from '../interfaces';
import { StreamState } from './stream-state.model';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class StreamResponse<TModel, TState extends IStreamState = IStreamState>
  extends BaseModel<StreamResponse<TModel, TState>>
  implements IStreamResponse<TModel, TState>
{
  @Expose()
  models: TModel[];

  @Expose()
  @PropertyType(StreamState)
  state: TState;

  @Expose()
  hasMore?: boolean;
}
