import { BaseModel, type PropertiesOf, PropertyType } from '@lyvely/common';
import { IStreamResponse, IStreamState } from '../interfaces';
import { StreamState } from './stream-state.model';
import { Exclude, Expose, instanceToPlain, Transform } from 'class-transformer';

@Exclude()
export class StreamResponse<TModel, TState extends IStreamState = IStreamState>
  implements IStreamResponse<TModel, TState>
{
  @Expose()
  @Transform(({ value }) => instanceToPlain(value))
  models: TModel[];

  @Expose()
  @PropertyType(StreamState)
  state: TState;

  @Expose()
  hasMore?: boolean;

  constructor(data: PropertiesOf<StreamResponse<TModel, TState>>) {
    BaseModel.init(this, data);
  }
}
