import { ref } from 'vue';
import { ModelValidator, IEditModelService } from '@lyvely/common';
import { cloneDeep, isEqual } from 'lodash';
import { loadingStatus, useStatus } from '@/store';

export interface IEditModelStoreOptions<
  TModel,
  TCreateModel,
  TUpdateModel = Partial<TCreateModel>,
  TID = string,
> {
  partialUpdate?: boolean;
  service:
    | IEditModelService<TModel, TCreateModel, TUpdateModel, TID>
    | ((
        editModel: TCreateModel | TUpdateModel,
      ) => IEditModelService<TModel, TCreateModel, TUpdateModel, TID>);
  onSubmitSuccess?: (response?: TModel) => void;
  onSubmitError?: ((err: any) => void) | false;
}
export function useUpdateModelStore<
  TModel,
  TCreateModel extends object,
  TUpdateModel extends object = Partial<TCreateModel>,
  TID = string,
>(options: IEditModelStoreOptions<TModel, TCreateModel, TUpdateModel, TID>) {
  type TEditModel = TUpdateModel | TCreateModel;
  const model = ref<TEditModel>();
  let original: TEditModel | undefined = undefined;
  const modelId = ref<TID>();
  const validator = ref<ModelValidator<TEditModel>>();
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
    if (!validator.value || !(await validator.value.validate())) {
      return;
    }

    try {
      const response = await loadingStatus<TModel | false, TModel | false>(
        isCreate.value ? _createModel() : _editModel(),
        status,
        validator.value,
      );

      if (response !== false && typeof options.onSubmitSuccess === 'function') {
        options.onSubmitSuccess(<TModel>response);
      }

      reset();
    } catch (err) {
      if (typeof options.onSubmitError === 'function') {
        options.onSubmitError(err);
      }
    }
  }

  async function _createModel(): Promise<TModel> {
    if (!model.value) {
      throw new Error('Could not create model without value');
    }

    return loadingStatus(
      _getService(model.value).create(<TCreateModel>model.value),
      status,
      validator.value,
    );
  }

  async function _editModel(): Promise<TModel | false> {
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
