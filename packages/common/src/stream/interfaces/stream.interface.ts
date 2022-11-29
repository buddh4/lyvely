export interface IStreamState {
  firstOrder?: number;
  lastOrder?: number;
  lastId?: string;
  firstId?: string;
  isEnd?: boolean;
}

export enum StreamDirection {
  ttb = 'ttb',
  btt = 'btt',
}

export interface IStreamOptions {
  batchSize: number;
  direction: StreamDirection;
}

export interface IStreamResponse<TModel, TState extends IStreamState = IStreamState> {
  models: TModel[];
  state: TState;
  hasMore?: boolean;
}

export interface IStreamRequest<TFilter extends IStreamFilter = any, TState extends IStreamState = IStreamState> {
  state?: TState;
  batchSize: number;
  filter?: TFilter;
}

export type IStreamFilter = Record<string, string | number>;

export interface IStream<
  TModel,
  TFilter extends IStreamFilter = any,
  TState extends IStreamState = IStreamState,
  TOptions extends IStreamOptions = IStreamOptions,
> {
  state: TState;
  options: TOptions;
  filter?: TFilter;
  models: TModel[];
  activeModels: TModel[];

  next(): Promise<TModel[]>;
  update(): Promise<TModel[]>;
}

export interface IStreamService<
  TModel,
  TFilter extends IStreamFilter = any,
  TState extends IStreamState = IStreamState,
  TOptions extends IStreamOptions = IStreamOptions,
> {
  loadNext(state: IStreamState, options: TOptions, filter?: TFilter): Promise<IStreamResponse<TModel, TState>>;
  update(state: IStreamState, options: TOptions, filter?: TFilter): Promise<IStreamResponse<TModel, TState>>;
}
