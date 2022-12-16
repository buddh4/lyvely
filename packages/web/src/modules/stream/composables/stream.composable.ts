import { IStreamFilter, IStreamOptions, IStreamService, IStreamState } from '@lyvely/common';
import { ref, Ref } from 'vue';
import { useStatus, loadingStatus, Status } from '@/store';

export function useStream<
  TModel,
  TFilter extends IStreamFilter = any,
  TOptions extends IStreamOptions = IStreamOptions,
>(
  options: TOptions,
  service: IStreamService<TModel, TFilter, IStreamState, TOptions>,
  filter?: TFilter,
) {
  const state = ref<IStreamState>({});
  const nextStatus = useStatus();
  const updateStatus = useStatus();
  const models = ref<TModel[]>([]) as Ref<TModel[]>;

  async function reload() {
    state.value = {};
    models.value = [];
    return next();
  }

  async function next() {
    if (state.value.isEnd) return;
    const response = await loadingStatus(
      service.loadNext(state.value, options, filter),
      nextStatus,
    );
    state.value = response.state;
    if (response.models?.length) {
      models.value = models.value.concat(response.models);
    }

    return response;
  }

  async function update() {
    const response = await loadingStatus(
      service.update(state.value, options, filter),
      updateStatus,
    );
    state.value = response.state;
    if (response.models?.length) {
      models.value = response.models.concat(models.value);
    }

    return response;
  }

  function isInitialized() {
    return !nextStatus.isStatusInit();
  }

  return {
    options,
    state,
    nextStatus,
    updateStatus,
    isInitialized,
    filter,
    models,
    next,
    update,
    reload,
  };
}
