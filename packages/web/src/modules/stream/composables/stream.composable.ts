import {
  IStreamFilter,
  IStreamOptions,
  IStreamService,
  IStreamState,
  StreamDirection,
} from '@lyvely/common';
import { nextTick, ref, Ref } from 'vue';
import { loadingStatus, useStatus } from '@/store';
import mitt from 'mitt';
import {
  hasOverflow,
  isScrolledToBottom,
  isScrolledToTop,
  scrollToBottom,
  scrollToTop,
} from '@/util/dom.util';
import { useInfiniteScroll } from '@vueuse/core';

type StreamEvents<TModel> = {
  'post.more': TModel[];
  'post.head': TModel[];
} & Record<string, any>;

export type IStream<
  TModel extends { id: string },
  TFilter extends IStreamFilter = any,
  TOptions extends IStreamOptions = IStreamOptions,
> = ReturnType<typeof useStream<TModel, TFilter, TOptions>>;

export interface IStreamInitOptions<TFilter extends IStreamFilter = any> {
  root?: HTMLElement;
  filter?: Ref<TFilter>;
  scrollToStart?: boolean;
  infiniteScroll?: { distance?: number } | boolean;
}

export interface IStreamRestoreOptions<
  TModel extends { id: string } = any,
  TFilter extends IStreamFilter = any,
> {
  root?: HTMLElement;
  history: IStream<TModel, TFilter>;
  filter?: Ref<TFilter>;
  infiniteScroll?: { distance?: number } | boolean;
}

class DummyFilter implements IStreamFilter {
  reset() {
    /* Nothing todo */
  }
}

export function useStream<
  TModel extends { id: string },
  TFilter extends IStreamFilter = any,
  TOptions extends IStreamOptions & { scrollToStart?: boolean } = IStreamOptions & {
    scrollToStart?: boolean;
  },
>(
  initOptions: TOptions,
  service: IStreamService<TModel, TFilter, IStreamState, TOptions>,
  filterInstance?: TFilter,
) {
  const state = ref<IStreamState>({});
  const loadTailStatus = useStatus();
  const loadHeadStatus = useStatus();
  const models = ref<TModel[]>([]) as Ref<TModel[]>;
  const events = mitt<StreamEvents<TModel>>();
  const root = ref<HTMLElement | null>(null);
  const filter = ref<TFilter>(filterInstance || <TFilter>new DummyFilter());
  const options = ref(initOptions);

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
      service.loadTail(state.value, options.value, <any>filter.value),
      loadTailStatus,
    );

    const response = await nextPromise;
    state.value = response.state;
    await addTail(response.models);

    return response;
  }

  async function init(initOptions?: IStreamInitOptions) {
    if (initOptions?.root) {
      root.value = initOptions.root;
    }

    if (initOptions?.filter) {
      filter.value = initOptions.filter;
    }

    reset(false);
    await _loadInitialEntries();

    _initInfiniteScroll(initOptions);

    options.value.scrollToStart = initOptions?.scrollToStart !== false;
    await _initialScroll();
  }

  async function restore(restoreOptions: IStreamRestoreOptions) {
    if (restoreOptions?.root) {
      root.value = restoreOptions.root;
    }

    models.value = restoreOptions.history.models.value;
    filter.value = restoreOptions.history.filter.value;
    state.value = restoreOptions.history.state.value;

    _initInfiniteScroll(restoreOptions);
  }

  async function _initialScroll() {
    if (options.value.scrollToStart !== false) {
      return scrollToStart();
    } else {
      return scrollToEnd();
    }
  }

  async function _loadInitialEntries() {
    if (!root.value) return loadTail();
    while (!hasOverflow(root.value) && !state.value.isEnd && !loadTailStatus.isStatusError()) {
      await loadTail();
    }
  }

  async function scrollToStart(attempt = 0) {
    if (!root.value) return;

    return new Promise((resolve) => {
      setTimeout(() => {
        nextTick(() => {
          if (options.value.direction === StreamDirection.BBT) {
            scrollToBottom(root.value!);
          } else {
            scrollToTop(root.value!);
          }
          if (attempt < 3 && root.value!.scrollTop !== root.value!.scrollHeight) {
            scrollToStart(++attempt).then(resolve);
          } else {
            resolve(true);
          }
        });
      }, 100);
    });
  }

  async function scrollToEnd() {
    if (!root.value) return;

    return new Promise((resolve) => {
      setTimeout(() => {
        nextTick(() => {
          if (options.value.direction === StreamDirection.BBT) {
            scrollToTop(root.value!);
          } else {
            scrollToBottom(root.value!);
          }
          resolve(true);
        });
      });
    });
  }

  function _initInfiniteScroll(initOptions?: IStreamInitOptions) {
    if (!root.value || !initOptions?.infiniteScroll) return;

    const infiniteScrollOptions =
      typeof initOptions.infiniteScroll === 'object' ? initOptions.infiniteScroll : {};

    useInfiniteScroll(
      root,
      () => {
        loadTail().catch((e) => console.error(e));
      },
      {
        distance: infiniteScrollOptions.distance || 50,
        preserveScrollPosition: false,
        direction: options.value.direction === StreamDirection.BBT ? 'top' : 'bottom',
      },
    );
  }

  async function addTail(newModels: TModel[]) {
    if (!newModels?.length) return;

    newModels = newModels.filter((model) => !getStreamEntryById(model.id));
    newModels = options.value.direction === StreamDirection.TTB ? newModels : newModels.reverse();

    events.emit('pre.next', newModels);

    if (options.value.direction === StreamDirection.TTB) {
      models.value = models.value.concat(newModels);
    } else {
      const preparedScrollValue = prepareScroll();
      models.value = newModels.concat(models.value);
      await nextTick(() => restoreScroll(preparedScrollValue));
    }

    events.emit('post.next', newModels);
  }

  function prepareScroll() {
    if (!root.value) return 0;
    return root.value?.scrollHeight - root.value.scrollTop;
  }

  function restoreScroll(previousScrollHeightMinusTop: number) {
    if (!root.value) return;

    return new Promise((resolve) => {
      setTimeout(() => {
        nextTick(() => {
          root.value!.scrollTop = root.value!.scrollHeight - previousScrollHeightMinusTop;
        });
      });
      resolve(true);
    });
  }

  async function loadHead() {
    if (loadHeadStatus.isStatusLoading()) return;

    const response = await loadingStatus(
      service.loadHead(state.value, options.value, <any>filter.value),
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

    newModels = options.value.direction === StreamDirection.TTB ? newModels : newModels.reverse();

    events.emit('pre.head', newModels);

    if (options.value.direction === StreamDirection.TTB) {
      const isScrollTop = root.value && isScrolledToTop(root.value);
      models.value = newModels.concat(updatedModels);
      if (autoScroll || isScrollTop) await scrollToStart();
    } else {
      const isScrollBottom = root.value && isScrolledToBottom(root.value);
      models.value = updatedModels.concat(newModels.reverse());
      if (autoScroll || isScrollBottom) await scrollToStart();
    }

    events.emit('post.head', newModels);
  }

  async function loadEntry(id: string) {
    const model = await service.loadEntry(id, <any>filter.value);
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

  function isInitialized() {
    return !loadTailStatus.isStatusInit();
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
    scrollToStart,
    addTail,
    addHead,
  };
}
