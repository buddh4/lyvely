import {
  IStreamFilter,
  IStreamOptions,
  IStreamService,
  IStreamState,
  PropertiesOf,
  StreamDirection,
} from '@lyvely/common';
import { nextTick, ref, Ref, watch } from 'vue';
import { loadingStatus, useStatus } from '@/store';
import mitt from 'mitt';
import { hasOverflow, isScrolledToBottom, scrollToBottom, scrollToTop } from '@/util/dom.util';
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
  options: TOptions,
  service: IStreamService<TModel, TFilter, IStreamState, TOptions>,
  filterInstance?: TFilter,
) {
  const state = ref<IStreamState>({});
  const loadTailStatus = useStatus();
  const loadHeadStatus = useStatus();
  const models = ref<TModel[]>([]) as Ref<TModel[]>;
  const events = mitt<StreamEvents<TModel>>();
  const root = ref<HTMLElement | null>(null);
  const filter = ref<TFilter>(filterInstance || <any>new DummyFilter());

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

  async function init(initOptions?: IStreamInitOptions) {
    if (initOptions?.root) {
      root.value = initOptions.root;
    }

    if (initOptions?.filter) {
      filter.value = initOptions.filter;
    }

    reset();
    await _loadInitialEntries();

    _initInfiniteScroll(initOptions);

    options.scrollToStart = initOptions?.scrollToStart !== false;
    await _initialScroll();
  }

  async function _initialScroll() {
    if (options.scrollToStart !== false) {
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

  async function scrollToStart() {
    if (!root.value) return;

    return new Promise((resolve) => {
      setTimeout(() => {
        nextTick(() => {
          if (options.direction === StreamDirection.BBT) {
            scrollToBottom(root.value!);
          } else {
            scrollToTop(root.value!);
          }
        });
      });
      resolve(true);
    });
  }

  async function scrollToEnd() {
    if (!root.value) return;

    return new Promise((resolve) => {
      setTimeout(() => {
        nextTick(() => {
          if (options.direction === StreamDirection.BBT) {
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
        preserveScrollPosition: true,
        direction: options.direction === StreamDirection.BBT ? 'top' : 'bottom',
      },
    );
  }

  async function addTail(newModels: TModel[]) {
    if (!newModels?.length) return;

    newModels = newModels.filter((model) => !getStreamEntryById(model.id));
    newModels = options.direction === StreamDirection.TTB ? newModels : newModels.reverse();

    events.emit('pre.next', newModels);

    debugger;
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
      service.loadHead(state.value, options, <any>filter.value),
      loadHeadStatus,
    );

    state.value = response.state;
    await addHead(response.models);

    return response;
  }

  async function addHead(newModels: TModel[]) {
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
      models.value = newModels.concat(updatedModels);
    } else {
      const isScrollBottom = root.value && isScrolledToBottom(root.value);
      models.value = updatedModels.concat(newModels.reverse());
      if (isScrollBottom) await nextTick(scrollToStart);
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
