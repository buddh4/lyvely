import { BaseModel } from '@lyvely/models';
import { IStreamResponse, IStreamState } from '../interfaces';
import { StreamState } from './stream-state.model';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class StreamResponse<TModel, TState extends IStreamState = IStreamState>
  extends BaseModel<StreamResponse<TModel, TState>>
  implements IStreamResponse<TModel, TState>
{
  @Expose()
  models: TModel[];

  @Expose()
  @Type(() => StreamState)
  state: TState;

  @Expose()
  hasMore?: boolean;
}
