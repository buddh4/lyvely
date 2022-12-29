export interface IStreamState {
  head?: number;
  headIds?: Array<string>;
  tail?: number;
  tailIds?: Array<string>;
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

export interface IStreamFilter {
  reset();
}

export interface IStreamService<
  TModel,
  TFilter extends IStreamFilter = any,
  TState extends IStreamState = IStreamState,
  TOptions extends IStreamOptions = IStreamOptions,
> {
  loadTail(
    state: IStreamState,
    options: TOptions,
    filter?: TFilter,
  ): Promise<IStreamResponse<TModel, TState>>;
  loadHead(
    state: IStreamState,
    options: TOptions,
    filter?: TFilter,
  ): Promise<IStreamResponse<TModel, TState>>;
  loadEntry(id: string, filter?: TFilter): Promise<TModel>;
}
