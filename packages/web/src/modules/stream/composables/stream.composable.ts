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
  'post.update': TModel[];
  'post.next': TModel[];
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

export function useStream<
  TModel extends { id: string },
  TFilter extends IStreamFilter = any,
  TOptions extends IStreamOptions & { scrollToStart?: boolean } = IStreamOptions & {
    scrollToStart?: boolean;
  },
>(
  options: TOptions,
  service: IStreamService<TModel, TFilter, IStreamState, TOptions>,
  filterInstance: TFilter,
) {
  const state = ref<IStreamState>({});
  const nextStatus = useStatus();
  const updateStatus = useStatus();
  const models = ref<TModel[]>([]) as Ref<TModel[]>;
  const events = mitt<StreamEvents<TModel>>();
  const root = ref<HTMLElement | null>(null);
  const filter = ref<TFilter>(filterInstance);

  function reset(hard = true) {
    state.value = {};
    models.value = [];

    if (hard) {
      filter.value?.reset();
    }
  }

  async function setFilter(f: TFilter) {
    filter.value = f;
    return reload();
  }

  async function updateFilter(f: Partial<PropertiesOf<TFilter>>) {
    filter.value = Object.assign(filter.value, f);
    return reload();
  }

  async function reload(hardReset = false) {
    reset(hardReset);
    const result = await next();
    await _initialScroll();
    return result;
  }

  let nextPromise: Promise<any>;
  async function next() {
    if (state.value.isEnd) return;
    if (nextStatus.isStatusLoading()) return nextPromise;

    nextPromise = loadingStatus(
      service.loadNext(state.value, options, <any>filter.value),
      nextStatus,
    );

    const response = await nextPromise;
    state.value = response.state;
    await addNext(response.models);

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
    if (!root.value) return next();
    while (!hasOverflow(root.value) && !state.value.isEnd && !nextStatus.isStatusError()) {
      await next();
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
        next().catch((e) => console.error(e));
      },
      {
        distance: infiniteScrollOptions.distance || 50,
        preserveScrollPosition: true,
        direction: options.direction === StreamDirection.BBT ? 'top' : 'bottom',
      },
    );
  }

  async function addNext(newModels: TModel[]) {
    if (!newModels?.length) return;

    newModels = newModels.filter((model) => !getStreamEntryById(model.id));
    newModels = options.direction === StreamDirection.TTB ? newModels : newModels.reverse();

    events.emit('pre.next', newModels);

    const preparedScrollValue = prepareScroll();
    if (options.direction === StreamDirection.TTB) {
      models.value = models.value.concat(newModels);
    } else {
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
    root.value.scrollTop = root.value.scrollHeight - previousScrollHeightMinusTop;
  }

  async function update() {
    if (updateStatus.isStatusLoading()) return;

    const response = await loadingStatus(
      service.update(state.value, options, <any>filter.value),
      updateStatus,
    );

    state.value = response.state;
    await addUpdates(response.models);

    return response;
  }

  async function addUpdates(newModels: TModel[]) {
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

    events.emit('pre.update', newModels);

    if (options.direction === StreamDirection.TTB) {
      models.value = newModels.concat(updatedModels);
    } else {
      const isScrollBottom = root.value && isScrolledToBottom(root.value);
      models.value = updatedModels.concat(newModels.reverse());
      if (isScrollBottom) await nextTick(scrollToStart);
    }

    events.emit('post.update', newModels);
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
    return !nextStatus.isStatusInit();
  }

  return {
    options,
    init,
    state,
    events,
    nextStatus,
    updateStatus,
    isInitialized,
    getStreamEntryAt,
    getStreamEntryById,
    filter,
    models,
    next,
    reset,
    update,
    loadEntry,
    reload,
    scrollToStart,
    addNext,
    addUpdates,
  };
}
