import mitt, { Emitter, Handler } from 'mitt';

export type FilterAddition<TModel, TOptions> = (
  model: TModel,
  filter: Filter<TModel, TOptions>,
) => boolean;

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
  setOption<T extends keyof TOptions>(key: T, value: TOptions[T]);
  setOptions(update: Partial<TOptions>);
  getOptions(): TOptions;
  getOptionsWithStringValues(): Record<string, string>;
  filter(models: TModel[]): TModel[];
  check(model: TModel);
  reset();
  isEmpty(): boolean;
  onUpdate(handler: Handler<FilterEvents<TOptions>['update']>);
  offUpdate(handler: Handler<FilterEvents<TOptions>['update']>);
}

export abstract class Filter<TModel, TOptions> implements IFilter<TModel, TOptions> {
  protected options: TOptions;
  protected additions: FilterAddition<TModel, TOptions>[] = [];
  protected emitter: Emitter<FilterEvents<TOptions>>;

  protected abstract checkModel(model: TModel);
  abstract isEmpty();

  constructor(options?: FilterConstructorOptions<TModel, TOptions>) {
    this.emitter = mitt<FilterEvents<TOptions>>();

    if (options) {
      options = { ...options };
      this.additions = options.additions;
      delete options.additions;
      this.setOptions(options);
    } else {
      this.reset();
    }

    this.additions = this.additions || [];
  }

  option<T extends keyof TOptions>(key: T): TOptions[T] {
    return this.options[key];
  }

  setOption<T extends keyof TOptions>(key: T, value: TOptions[T]) {
    if (this.options[key] !== value) {
      this.setOptions(<any>{ [key]: value });
    }
  }

  getOptions() {
    return { ...this.options };
  }

  getOptionsWithStringValues(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const option in this.options) {
      const value = this.options[option];
      if (value && typeof value === 'object' && 'toString' in value) {
        result[option] = value.toString();
      } else if (value) {
        result[option] = `${value}`;
      }
    }
    return result;
  }

  setOptions(update: Partial<TOptions>) {
    this.options = this.options || this.getDefaultOptions();

    const old = { ...this.options };

    let hasChanged = false;
    for (const key in update) {
      if (this.options[key] !== update[key]) {
        this.options[key] = update[key];
        hasChanged = true;
      }
    }

    if (hasChanged) {
      this.emitter.emit('update', {
        old: old,
        update: update,
      });
    }
  }

  filter(models: TModel[]) {
    return models.filter((model) => this.check(model));
  }

  check(model: TModel) {
    if (!this.runAdditions(model)) {
      return false;
    }

    return this.checkModel(model);
  }

  protected runAdditions(model: TModel) {
    let result = true;
    this.additions.forEach((addition) => {
      if (!addition(model, this)) {
        result = false;
      }
    });
    return result;
  }

  protected getDefaultOptions(): TOptions {
    return <any>{};
  }

  reset() {
    this.options = this.getDefaultOptions();
  }

  onUpdate(handler: Handler<FilterEvents<TOptions>['update']>) {
    this.emitter.on('update', handler);
  }

  offUpdate(handler: Handler<FilterEvents<TOptions>['update']>) {
    this.emitter.off('update', handler);
  }
}
