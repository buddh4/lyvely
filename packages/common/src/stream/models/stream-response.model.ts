import { BaseModel } from '@/models';
import { IStreamResponse, IStreamState, StreamState } from '@/stream';
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
