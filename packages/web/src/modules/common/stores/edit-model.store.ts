import { ref, Ref } from 'vue';
import { ModelValidator } from '@lyvely/common';
import { AxiosResponse } from 'axios';
import { cloneDeep, isEqual } from 'lodash';

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
export default function <TUpdateModel extends object, TResponse, TID = string>(
  options: IEditModelStoreOptions<TUpdateModel, TResponse, TID>,
) {
  const model = ref<TUpdateModel | undefined>(undefined) as Ref<TUpdateModel | undefined>;
  let original: TUpdateModel | undefined = undefined;
  const modelId = ref(undefined) as Ref<TID | undefined>;
  const validator = ref(undefined) as Ref<ModelValidator<TUpdateModel> | undefined>;
  const error = ref('');
  const isActive = ref(false);
  const isCreate = ref(false);

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
      error.value = '';
    }
  }

  async function submit() {
    if (!validator.value || !(await validator.value.validate())) {
      return;
    }

    try {
      const response = isCreate.value ? await _createModel() : await _editModel();
      if (response !== false && typeof options.onSubmitSuccess === 'function') {
        options.onSubmitSuccess(response?.data);
      }

      reset();
    } catch (err) {
      if (typeof options.onSubmitError === 'function') {
        options.onSubmitError(err);
      } else if (options.onSubmitError !== false) {
        error.value = 'error.unknown';
      }
    }
  }

  async function _createModel() {
    if (!model.value) {
      return;
    }

    return await _getRepository(model.value).create(model.value);
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

    return await _getRepository(model.value).update(modelId.value, update);
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
    error,
    isActive,
    isCreate,
    setEditModel,
    setCreateModel,
    submit,
    reset,
  };
}
