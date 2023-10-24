import { Ref, ref } from 'vue';
import { ModelValidator, IEditModelService } from '@lyvely/common';
import { cloneDeep, isEqual } from 'lodash';
import { loadingStatus, useStatus, eventBus } from '@/core';

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

  options.partialUpdate ??= true;
  options.resetOnSuccess ??= true;

  function setUpdateModel(id: TID, model: TUpdateModel) {
    isCreate.value = false;
    _setModel(model, id);
  }

  function setCreateModel(model: TCreateModel) {
    isCreate.value = true;
    _setModel(model);
  }

  function reset() {
    _setModel(undefined);
  }

  function _setModel(newModel?: TUpdateModel | TCreateModel, id?: TID) {
    if (newModel) {
      model.value = newModel;
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
        options.onSubmitSuccess(<TResponse>response);
      }

      if (!isCreate.value && response === false && typeof options.onSubmitSuccess === 'function') {
        options.onSubmitSuccess();
      }

      if (options.resetOnSuccess) {
        reset();
      } else if (isCreate.value) {
        setCreateModel(model.value as TCreateModel);
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
      for (const field in model.value) {
        if (!isEqual(model.value[<keyof TEditModel>field], original[<keyof TEditModel>field])) {
          update[<keyof typeof model>field] = (<any>model).value[field];
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
