import { ref, Ref } from 'vue';
import { ModelValidator } from '@lyvely/common';
import { AxiosResponse } from 'axios';
import { cloneDeep, isEqual } from 'lodash';
import { loadingStatus, useStatus } from '@/store';

export interface IEditModelService<TUpdateModel, TResponse, TID = string> {
  create: (model: TUpdateModel) => Promise<TResponse>;
  update: (id: TID, model: Partial<TUpdateModel>) => Promise<TResponse>;
}

export interface IEditModelStoreOptions<TUpdateModel, TResponse, TID = string> {
  partialUpdate?: boolean;
  service:
    | IEditModelService<TUpdateModel, TResponse, TID>
    | ((editModel: TUpdateModel) => IEditModelService<TUpdateModel, TResponse, TID>);
  onSubmitSuccess?: (response?: TResponse) => void;
  onSubmitError?: ((err: any) => void) | false;
}
export function useUpdateModelStore<TUpdateModel extends object, TResponse, TID = string>(
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
      const response = await loadingStatus(
        isCreate.value ? _createModel() : _editModel(),
        status,
        validator.value,
      );

      if (response !== false && typeof options.onSubmitSuccess === 'function') {
        options.onSubmitSuccess(<TResponse>response);
      }

      reset();
    } catch (err) {
      if (typeof options.onSubmitError === 'function') {
        options.onSubmitError(err);
      }
    }
  }

  async function _createModel(): Promise<TResponse> {
    if (!model.value) {
      throw new Error('Could not create model without value');
    }

    return loadingStatus(_getService(model.value).create(model.value), status, validator.value);
  }

  async function _editModel(): Promise<TResponse | false> {
    if (!model.value || !modelId.value || !original) {
      throw new Error('Could not edit model without value');
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

    return loadingStatus(
      _getService(model.value).update(modelId.value, update),
      status,
      validator.value,
    );
  }

  function _getService(m: TUpdateModel) {
    if (typeof options.service === 'function') {
      return options.service(m);
    }

    return options.service;
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
