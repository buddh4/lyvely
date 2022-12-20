export interface IStreamState {
  firstOrder?: number;
  lastOrder?: number;
  lastId?: string;
  firstId?: string;
  /**
   * Indicates if the last entry has been loaded
   */
  isEnd?: boolean;
}

export enum StreamDirection {
  /**
   * Top to bottom, the newest entries on top
   */
  TTB = 'ttb',
  /**
   * Bottom to top, the newest entries at bottom
   */
  BBT = 'btt',
}

export interface IStreamOptions {
  batchSize: number;
  direction: StreamDirection;
}

export interface IStreamResponse<TModel, TState extends IStreamState = IStreamState> {
  models: TModel[];
  state: TState;
  /**
   * Indicates if there are still entries available, e.g. when loading updates
   */
  hasMore?: boolean;
}

export interface IStreamRequest<
  TFilter extends IStreamFilter = any,
  TState extends IStreamState = IStreamState,
> {
  state?: TState;
  batchSize: number;
  filter?: TFilter;
}

export type IStreamFilter = Record<string, string | number>;

export interface IStreamService<
  TModel,
  TFilter extends IStreamFilter = any,
  TState extends IStreamState = IStreamState,
  TOptions extends IStreamOptions = IStreamOptions,
> {
  loadNext(
    state: IStreamState,
    options: TOptions,
    filter?: TFilter,
  ): Promise<IStreamResponse<TModel, TState>>;
  update(
    state: IStreamState,
    options: TOptions,
    filter?: TFilter,
  ): Promise<IStreamResponse<TModel, TState>>;
  loadEntry(id: string, filter?: TFilter): Promise<TModel>;
}
