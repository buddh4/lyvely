import { ref, Ref } from 'vue';
import { ModelValidator } from "@lyvely/common";
import { AxiosResponse} from 'axios';
import { DialogExceptionHandler } from "@/modules/core/handler/exception.handler";
import { cloneDeep, isEqual } from "lodash";

export interface EditModelRepository<TUpdateModel, TResponse,  TID = string> {
  create: (model: TUpdateModel ) => Promise<AxiosResponse<TResponse>>
  update: (id: TID, model: Partial<TUpdateModel>) => Promise<AxiosResponse<TResponse>>
}

export interface EditModelStoreOptions<TUpdateModel, TResponse, TID = string> {
  repository: EditModelRepository<TUpdateModel, TResponse, TID> | ((editModel: TUpdateModel) => EditModelRepository<TUpdateModel, TResponse, TID>),
  onSubmitSuccess?: (response?: TResponse) => void
  onSubmitError?: ((err: any) => void) | false
}
export default function<TUpdateModel, TResponse, TID = string>(options: EditModelStoreOptions<TUpdateModel, TResponse, TID>) {
  const model = ref<TUpdateModel|undefined>(undefined) as Ref<TUpdateModel|undefined>;
  let original: TUpdateModel|undefined = undefined;
  const modelId = ref(undefined) as Ref<TID|undefined>;
  const validator = ref(undefined) as Ref<ModelValidator|undefined>;
  const isActive = ref(false);
  const isCreate = ref(false);

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
    if(newModel) {
      model.value = newModel;
      original = cloneDeep(newModel);
      modelId.value = id;
      validator.value = new ModelValidator(model);
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
      const response = isCreate.value ? await _createModel() : await _editModel();
      if(response !== false && typeof options.onSubmitSuccess === 'function') {
        options.onSubmitSuccess(response?.data);
      }

      reset();
    } catch(err) {
      if(typeof options.onSubmitError === 'function') {
        options.onSubmitError(err);
      } else if(options.onSubmitError !== false) {
        DialogExceptionHandler('An unexpected error occurred, please try again later')(err);
      }
    }
  }

  async function _createModel() {
    if(!model.value) {
      return;
    }

    return await _getRepository(model.value).create(model.value);
  }

  async function _editModel() {
    if(!model.value || !modelId.value || !original) {
      console.warn('Could not edit model due to inconsistent state.');
      return;
    }

    const update: Partial<TUpdateModel> = {};
    for(const field in model.value) {
      if(!isEqual(model.value[field], original[field])) {
        // @ts-ignore
        update[field] = model.value[field];
      }
    }

    if(Object.keys(update).length === 0) {
      return false;
    }

    return await _getRepository(model.value).update(modelId.value, update)
  }

  function _getRepository(m: TUpdateModel) {
    if(typeof options.repository === "function") {
      return options.repository(m);
    }

    return options.repository;
  }

  function getError(field: string) {
    return validator?.value?.getError(field);
  }

  function getErrors() {
    return validator?.value?.getErrors();
  }

  return {
    model,
    modelId,
    validator,
    isActive,
    isCreate,
    setEditModel,
    setCreateModel,
    submit,
    getError,
    getErrors,
    reset
  }
}
