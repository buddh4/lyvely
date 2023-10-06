import { Emitter, Handler } from 'mitt';
export type FilterAddition<TModel, TOptions, TFilter extends IFilter<TModel, TOptions> = IFilter<TModel, TOptions>> = (model: TModel, filter: TFilter) => boolean;
export type FilterConstructorOptions<TModel, TOptions> = TOptions & {
    additions?: FilterAddition<TModel, TOptions>[];
};
type FilterEvents<TOptions> = {
    update: {
        old: TOptions;
        update: Partial<TOptions>;
    };
};
export interface IFilter<TModel, TOptions> {
    option<T extends keyof TOptions>(key: T): TOptions[T];
    setOption<T extends keyof TOptions>(key: T, value: TOptions[T]): any;
    setOptions(update: Partial<TOptions>): any;
    getOptions(): TOptions;
    getOptionsWithStringValues(): Record<string, string>;
    filter(models: TModel[]): TModel[];
    check(model: TModel): any;
    reset(): any;
    isEmpty(): boolean;
    onUpdate(handler: Handler<FilterEvents<TOptions>['update']>): any;
    offUpdate(handler: Handler<FilterEvents<TOptions>['update']>): any;
}
export declare abstract class Filter<TModel, TOptions, TFilter extends IFilter<TModel, TOptions> = IFilter<TModel, TOptions>> implements IFilter<TModel, TOptions> {
    protected options: TOptions;
    protected additions: FilterAddition<TModel, TOptions, TFilter>[];
    protected emitter: Emitter<FilterEvents<TOptions>>;
    protected abstract checkModel(model: TModel): any;
    abstract isEmpty(): any;
    constructor(options?: FilterConstructorOptions<TModel, TOptions>);
    option<T extends keyof TOptions>(key: T): TOptions[T];
    setOption<T extends keyof TOptions>(key: T, value: TOptions[T]): void;
    getOptions(): TOptions;
    getOptionsWithStringValues(): Record<string, string>;
    setOptions(update: Partial<TOptions>): void;
    filter(models: TModel[]): TModel[];
    check(model: TModel): any;
    protected runAdditions(model: TModel): boolean;
    protected getDefaultOptions(): TOptions;
    reset(): void;
    onUpdate(handler: Handler<FilterEvents<TOptions>['update']>): void;
    offUpdate(handler: Handler<FilterEvents<TOptions>['update']>): void;
}
export {};
