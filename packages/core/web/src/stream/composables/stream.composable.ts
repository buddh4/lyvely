import {
  IStreamFilter,
  IStreamHistory,
  IStreamOptions,
  IStreamService,
  IStreamState,
  StreamDirection,
  IStreamRestoreState,
} from '@lyvely/core-interface';
import { nextTick, ref, Ref } from 'vue';
import {
  loadingStatus,
  useStatus,
  hasOverflow,
  isScrolledToBottom,
  isScrolledToTop,
  scrollToBottom,
  scrollToTop,
} from '@/core';
import mitt from 'mitt';
import { useInfiniteScroll } from '@vueuse/core';

type StreamEvents<TModel> = {
  'post.more': TModel[];
  'post.head': TModel[];
} & Record<string, any>;

export type IStream<
  TModel extends { id: string },
  TFilter extends IStreamFilter = any,
  TRestoreState extends IStreamRestoreState = IStreamRestoreState,
  TState extends IStreamState = IStreamState,
  TOptions extends IStreamOptions = IStreamOptions,
> = ReturnType<typeof useStream<TModel, TFilter, TRestoreState, TState, TOptions>>;

export interface IStreamViewOptions<TFilter extends IStreamFilter = any> extends IStreamOptions {
  root?: Ref<HTMLElement>;
  filter?: Ref<TFilter>;
  scrollToHeadOnInit?: boolean;
  scrollToHead?: () => Promise<void>;
  scrollToTail?: () => Promise<void>;
  infiniteScroll?: { distance?: number } | boolean;
}

class MockFilter implements IStreamFilter {
  reset() {
    /* Nothing todo */
  }
}

export function useStream<
  TModel extends { id: string },
  TFilter extends IStreamFilter | MockFilter = any,
  TRestoreState extends IStreamRestoreState = IStreamRestoreState,
  TState extends IStreamState = IStreamState,
  TOptions extends IStreamViewOptions = IStreamViewOptions,
>(initOptions: TOptions, service: IStreamService<TModel, TFilter, IStreamState, TOptions>) {
  const options = initOptions;
  const state = ref<IStreamState>({});
  const loadTailStatus = useStatus();
  const loadHeadStatus = useStatus();
  const models = ref<TModel[]>([]) as Ref<TModel[]>;
  const events = mitt<StreamEvents<TModel>>();
  const filter = options.filter || ref(new MockFilter());
  const isInitialized = ref(false);

  function reset(hard = true) {
    state.value = {};
    models.value = [];

    if (hard) {
      filter.value?.reset();
    }
  }

  async function reload(hardReset = false) {
    reset(hardReset);
    const result = await loadTail();
    await _initialScroll();
    return result;
  }

  let nextPromise: Promise<any>;
  async function loadTail() {
    if (state.value.isEnd) return;
    if (loadTailStatus.isStatusLoading()) return nextPromise;

    nextPromise = loadingStatus(
      service.loadTail(state.value, options, <any>filter.value),
      loadTailStatus,
    );

    const response = await nextPromise;
    state.value = response.state;
    await addTail(response.models);

    return response;
  }

  async function init() {
    isInitialized.value = false;

    reset(false);

    await _loadInitialEntries();

    _initInfiniteScroll();

    options.scrollToHeadOnInit = initOptions?.scrollToHeadOnInit || options.scrollToHeadOnInit;

    await _initialScroll();
    return new Promise((resolve) => {
      setTimeout(() => resolve((isInitialized.value = true)), 50);
    });
  }

  async function restore(
    history: IStreamHistory<TModel, TRestoreState, TFilter, TState, TOptions>,
  ) {
    isInitialized.value = false;
    models.value = history.models;
    filter.value = history.filter;
    state.value = history.state;
    _initInfiniteScroll();

    nextTick(() => {
      if (options.root?.value && history.restoreState.scrollTop) {
        options.root!.value!.scrollTop = history.restoreState.scrollTop;
      }
    });

    return new Promise((resolve) => {
      setTimeout(() => resolve((isInitialized.value = true)), 50);
    });
  }

  async function _loadInitialEntries() {
    if (!options.root?.value || !options.infiniteScroll) return loadTail();
    // In case of infiniteScroll, we have to make sure we create an overflow
    while (
      !hasOverflow(options.root.value) &&
      !state.value.isEnd &&
      !loadTailStatus.isStatusError()
    ) {
      await loadTail();
    }
  }

  async function _initialScroll() {
    return options.scrollToHeadOnInit !== false ? scrollToHead() : scrollToTail();
  }

  async function scrollToHead() {
    if (!options.root?.value) return;

    return options.scrollToHead
      ? options.scrollToHead()
      : new Promise((resolve) => {
          setTimeout(() => {
            nextTick(() => {
              if (options.direction === StreamDirection.BBT) {
                scrollToBottom(options.root!.value!);
              } else {
                scrollToTop(options.root!.value!);
              }
              resolve(true);
            });
          }, 100);
        });
  }

  async function scrollToTail() {
    if (!options.root?.value) return;
    return options.scrollToTail
      ? options.scrollToTail()
      : new Promise((resolve) => {
          setTimeout(() => {
            nextTick(() => {
              if (options.direction === StreamDirection.BBT) {
                scrollToTop(options.root!.value!);
              } else {
                scrollToBottom(options.root!.value!);
              }
              resolve(true);
            });
          });
        });
  }

  function _initInfiniteScroll() {
    if (!options.root || !options.infiniteScroll) return;

    const infiniteScrollOptions =
      typeof options.infiniteScroll === 'object' ? options.infiniteScroll : {};

    useInfiniteScroll(
      options.root,
      () => {
        loadTail().catch((e) => console.error(e));
      },
      {
        distance: infiniteScrollOptions.distance || 50,
        direction: options.direction === StreamDirection.BBT ? 'top' : 'bottom',
      },
    );
  }

  async function addTail(newModels: TModel[]) {
    if (!newModels?.length) return;

    newModels = newModels.filter((model) => !getStreamEntryById(model.id));
    newModels = options.direction === StreamDirection.TTB ? newModels : newModels.reverse();

    events.emit('pre.next', newModels);

    if (options.direction === StreamDirection.TTB) {
      models.value = models.value.concat(newModels);
    } else {
      const preparedScrollValue = prepareScroll();
      models.value = newModels.concat(models.value);
      await nextTick(() => restoreScroll(preparedScrollValue));
    }

    events.emit('post.next', newModels);
  }

  function prepareScroll() {
    if (!options.root?.value) return 0;
    return options.root.value.scrollHeight - options.root.value.scrollTop;
  }

  function restoreScroll(previousScrollHeightMinusTop: number) {
    if (!options.root?.value) return;

    return new Promise((resolve) => {
      setTimeout(() => {
        options.root!.value!.scrollTop =
          options.root!.value.scrollHeight - previousScrollHeightMinusTop;
      });
      resolve(true);
    });
  }

  async function loadHead() {
    if (loadHeadStatus.isStatusLoading()) return;

    const response = await loadingStatus(
      service.loadHead(state.value, options, <any>filter.value),
      loadHeadStatus,
    );

    state.value = response.state;
    await addHead(response.models);

    return response;
  }

  async function addHead(newModels: TModel[], autoScroll = false) {
    if (!newModels?.length) return;

    const updatedModels = [...models.value];

    newModels.forEach((model) => {
      const index = getStreamEntryIndexById(model.id);

      if (index !== -1) {
        updatedModels.splice(index, 1);
      }

      return true;
    });

    newModels = options.direction === StreamDirection.TTB ? newModels : newModels.reverse();

    events.emit('pre.head', newModels);

    if (options.direction === StreamDirection.TTB) {
      const isScrollTop = options.root?.value && isScrolledToTop(options.root.value);
      models.value = newModels.concat(updatedModels);
      if (autoScroll || isScrollTop) await scrollToHead();
    } else {
      const isScrollBottom = options.root?.value && isScrolledToBottom(options.root?.value);
      models.value = updatedModels.concat(newModels.reverse());
      if (autoScroll || isScrollBottom) await scrollToHead();
    }

    events.emit('post.head', newModels);
  }

  async function loadEntry(id: string) {
    const model = await service.loadEntry(id, filter.value);
    if (!model) return null;

    const index = models.value.findIndex((model) => model.id === id);
    if (index !== -1) {
      models.value[index] = model;
    }
    return model;
  }

  function getStreamEntryAt(index: number): TModel | undefined {
    if (index < 0 || index > models.value.length - 1) return undefined;
    return models.value[index];
  }

  function getStreamEntryById(id: string): TModel | undefined {
    return models.value.find((model) => model.id === id);
  }

  function getStreamEntryIndexById(id: string): number {
    return models.value.findIndex((model) => model.id === id);
  }

  return {
    options,
    init,
    restore,
    state,
    events,
    loadTailStatus,
    loadHeadStatus,
    isInitialized,
    getStreamEntryAt,
    getStreamEntryById,
    filter,
    models,
    loadTail,
    reset,
    loadHead,
    loadEntry,
    reload,
    scrollToHead,
    scrollToTail,
    addTail,
    addHead,
  };
}
