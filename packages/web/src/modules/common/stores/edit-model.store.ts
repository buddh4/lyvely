import { ref, Ref } from 'vue';
import { ModelValidator } from '@lyvely/common';
import { AxiosResponse } from 'axios';
import { cloneDeep, isEqual } from 'lodash';
import { loadingStatus, useStatus } from '@/store';

export interface IEditModelRepository<TUpdateModel, TResponse, TID = string> {
  create: (model: TUpdateModel) => Promise<AxiosResponse<TResponse>>;
  update: (id: TID, model: Partial<TUpdateModel>) => Promise<AxiosResponse<TResponse>>;
}

export interface IEditModelStoreOptions<TUpdateModel, TResponse, TID = string> {
  partialUpdate?: boolean;
  repository:
    | IEditModelRepository<TUpdateModel, TResponse, TID>
    | ((editModel: TUpdateModel) => IEditModelRepository<TUpdateModel, TResponse, TID>);
  onSubmitSuccess?: (response?: TResponse) => void;
  onSubmitError?: ((err: any) => void) | false;
}
export function useEditModelStore<TUpdateModel extends object, TResponse, TID = string>(
  options: IEditModelStoreOptions<TUpdateModel, TResponse, TID>,
) {
  const model = ref<TUpdateModel | undefined>(undefined) as Ref<TUpdateModel | undefined>;
  let original: TUpdateModel | undefined = undefined;
  const modelId = ref<TID>();
  const validator = ref<ModelValidator<TUpdateModel>>();
  const isActive = ref(false);
  const isCreate = ref(false);
  const status = useStatus();

  options.partialUpdate = options.partialUpdate ?? true;

  function setEditModel(id: TID, model: TUpdateModel) {
    isCreate.value = false;
    _setModel(model, id);
  }

  function setCreateModel(model: TUpdateModel) {
    isCreate.value = true;
    _setModel(model);
  }

  function reset() {
    _setModel(undefined);
  }

  function _setModel(newModel?: TUpdateModel, id?: TID) {
    if (newModel) {
      model.value = newModel;
      original = cloneDeep(newModel);
      modelId.value = id;
      validator.value = new ModelValidator<TUpdateModel>(model.value);
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
    if (!validator.value || !(await validator.value.validate())) {
      return;
    }

    try {
      const response = await loadingStatus(isCreate.value ? _createModel() : _editModel(), status, validator.value);
      if (response !== false && typeof options.onSubmitSuccess === 'function') {
        options.onSubmitSuccess(response?.data);
      }

      reset();
    } catch (err) {
      if (typeof options.onSubmitError === 'function') {
        options.onSubmitError(err);
      }
    }
  }

  async function _createModel() {
    if (!model.value) {
      return;
    }

    return loadingStatus(_getRepository(model.value).create(model.value), status, validator.value);
  }

  async function _editModel() {
    if (!model.value || !modelId.value || !original) {
      console.warn('Could not edit model due to inconsistent state.');
      return;
    }

    let update: Partial<TUpdateModel> = {};

    if (options.partialUpdate) {
      for (const field in model.value) {
        if (!isEqual(model.value[field], original[field])) {
          update[field as keyof typeof update] = model.value[field as keyof typeof update];
        }
      }

      if (Object.keys(update).length === 0) return false;
    } else {
      update = model.value;
    }

    return loadingStatus(_getRepository(model.value).update(modelId.value, update), status, validator.value);
  }

  function _getRepository(m: TUpdateModel) {
    if (typeof options.repository === 'function') {
      return options.repository(m);
    }

    return options.repository;
  }

  return {
    model,
    modelId,
    validator,
    status,
    isActive,
    isCreate,
    setEditModel,
    setCreateModel,
    submit,
    reset,
  };
}
