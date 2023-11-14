import { Ref, ref, toValue } from 'vue';
import { ModelValidator, IEditModelService } from '@lyvely/common';
import { cloneDeep, isEqual } from 'lodash';
import { loadingStatus, useStatus, eventBus } from '@/core';
import { useProfileStore } from '@/profiles/stores/profile.store';
import { watchDebounced } from '@vueuse/core';

/**
 * Defines options used when creating an update model store.
 */
export interface IUpdateModelStoreOptions<
  TModel,
  TCreateModel,
  TUpdateModel = Partial<TCreateModel>,
  TResponse = TModel,
  TID = string,
> {
  /**
   * Allow partial update
   * @default true
   **/
  partialUpdate?: boolean;

  /**
   * Used for automatic backups of the create model.
   * If not set the constructor name of persistId is used.
   * If set to false, auto-persist is disabled.
   */
  persistId?: string | false;

  /**
   * Reset the model once submit succeeded
   * @default true
   */
  resetOnSuccess?: boolean;

  /**
   * The service responsible for updating the model
   */
  service:
    | IEditModelService<TResponse, TCreateModel, TUpdateModel, TID>
    | ((
        editModel: TCreateModel | TUpdateModel,
      ) => IEditModelService<TResponse, TCreateModel, TUpdateModel, TID>);

  /**
   * Hook called after a successful submit
   */
  onSubmitSuccess?: (response?: TResponse) => void;

  /**
   * Hook called after an error while submit
   */
  onSubmitError?: ((err: any) => void) | false;
}

/**
 * Can be used to create an edit store.
 *
 * @example
 *
 * <script lang="ts" setup>
 * const updateStore = useUpdateModelStore({
 *   service: useMyModelService()
 * });
 *
 * const { setUpdateModel, submit, status } = updateStore;
 * const { model, validator } = storeToRefs(updateStore);
 *
 * setUpdateModel(myUpdateModel);
 * </script>
 *
 * <template>
 *  <ly-form-model v-model="model" :validator="validator">
 *    <!-- Insert Form -->
 *    <ly-button @click="submit" :loading="status.isLoading()">
 *  </ly-form-model>
 * </template>
 * @param options
 */
export function useUpdateModelStore<
  TModel,
  TCreateModel extends object,
  TUpdateModel extends object = Partial<TCreateModel>,
  TResponse = TModel,
  TID = string,
>(options: IUpdateModelStoreOptions<TModel, TCreateModel, TUpdateModel, TResponse, TID>) {
  type TEditModel = TUpdateModel | TCreateModel;
  const model = ref<TEditModel>();
  let original: TEditModel | undefined = undefined;
  const modelId = ref<TID>();
  const validator = ref<ModelValidator<TEditModel>>();
  const isActive = ref(false);
  const isCreate = ref(false);
  const status = useStatus();
  let unwatchModel: Function | undefined = undefined;

  options.partialUpdate ??= true;
  options.resetOnSuccess ??= true;

  function setUpdateModel(id: TID, model: TUpdateModel) {
    isCreate.value = false;
    _setModel(model, id);
  }

  function setCreateModel(model: TCreateModel, ignoreBackup = false) {
    isCreate.value = true;
    if (options.persistId !== false) {
      options.persistId ??= model.constructor.name;
    }
    if (!ignoreBackup) applyBackup(model);
    _setModel(model);
    runBackup();
  }

  function applyBackup(model: TCreateModel | TUpdateModel) {
    if (!options.persistId) return;
    const backupStr = localStorage.getItem(getBackupKey());
    if (!backupStr) return;

    try {
      const backup = JSON.parse(backupStr);
      for (const field of Object.keys(backup)) {
        if (applyBackupField(model[field], backup[field])) {
          model[field] = backup[field];
        }
      }
    } catch (e) {
      console.log('Could not apply backup', e);
      localStorage.removeItem(getBackupKey());
    }
  }

  function applyBackupField(modelValue: unknown, backupValue: unknown) {
    if (isEqual(modelValue, backupValue)) return false;
    if (typeof modelValue === 'string' && modelValue.length) return false;
    return true;
  }

  function runBackup() {
    if (!options.persistId) return;

    unwatchModel = watchDebounced(
      () => model.value,
      () => {
        localStorage.setItem(getBackupKey(), JSON.stringify(toValue(model.value)));
      },
      { deep: true },
    );
  }

  function getBackupKey() {
    const { profile } = useProfileStore();
    const prefix = isCreate.value ? 'create' : 'edit';
    const suffix = isCreate.value ? '' : `:${modelId.value}`;
    return `${prefix}:${options.persistId}${profile?.id}${suffix}`;
  }

  function reset() {
    _setModel(undefined);
  }

  function _setModel(newModel?: TUpdateModel | TCreateModel, id?: TID) {
    if (unwatchModel) unwatchModel();
    unwatchModel = undefined;

    if (newModel) {
      newModel = toValue(newModel);
      model.value = toValue(newModel);
      original = cloneDeep(newModel);
      modelId.value = id;
      validator.value = new ModelValidator<TEditModel>(model.value);
      isActive.value = true;
    } else {
      original = undefined;
      model.value = undefined;
      modelId.value = undefined;
      validator.value = undefined;
      isActive.value = false;
    }
  }

  async function submit() {
    if (!validator.value || !(await validator.value.validate())) return Promise.reject();

    try {
      const response = await loadingStatus<TResponse | false>(
        isCreate.value ? _createModel() : _editModel(),
        status,
        validator.value,
      );

      if (response !== false && typeof options.onSubmitSuccess === 'function') {
        const event = isCreate.value ? 'created' : 'updated';
        eventBus.emit(`model.${event}.post`, response);
        localStorage.removeItem(getBackupKey());
        options.onSubmitSuccess(<TResponse>response);
      }

      // No changes in partial update is considered as success.
      if (!isCreate.value && response === false && typeof options.onSubmitSuccess === 'function') {
        localStorage.removeItem(getBackupKey());
        options.onSubmitSuccess();
      }

      if (options.resetOnSuccess) {
        reset();
      } else if (isCreate.value) {
        setCreateModel(model.value as TCreateModel, true);
      } else {
        setUpdateModel(modelId.value!, model.value as TUpdateModel);
      }
      return response;
    } catch (err) {
      if (typeof options.onSubmitError === 'function') {
        options.onSubmitError(err);
      }
      throw err;
    }
  }

  async function _createModel(): Promise<TResponse> {
    if (!model.value) {
      throw new Error('Could not create model without value');
    }

    return loadingStatus(
      _getService(model.value).create(<TCreateModel>model.value),
      status,
      validator.value,
    );
  }

  async function _editModel(): Promise<TResponse | false> {
    if (!model.value || !modelId.value || !original) {
      throw new Error('Could not edit model without value');
    }

    let update: Partial<typeof model> = {};

    if (options.partialUpdate) {
      for (const field of Object.keys(model.value)) {
        if (!isEqual(model.value[field], original[field])) {
          update[field] = model.value[field];
        }
      }

      if (Object.keys(update).length === 0) return false;
    } else {
      update = model.value;
    }

    return loadingStatus(
      _getService(model.value).update(modelId.value, update as TUpdateModel),
      status,
      validator.value,
    );
  }

  function _getService(m: TEditModel) {
    if (typeof options.service === 'function') {
      return options.service(m);
    }

    return options.service;
  }

  return {
    model: <Ref<TEditModel>>model,
    modelId,
    validator: <Ref<ModelValidator<TEditModel>>>validator,
    status,
    isActive,
    isCreate,
    setUpdateModel,
    setCreateModel,
    submit,
    reset,
  };
}
