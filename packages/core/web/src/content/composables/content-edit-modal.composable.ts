import { computed, ref, Ref } from 'vue';
import { ModelValidator, IEditableModel } from '@lyvely/common';
import { ContentModel, CreateContentModel, ContentUpdateResponse } from '@lyvely/core-interface';
import { IEditOrCreateModalProps } from '@/content/interfaces/edit-content-modal-props.interface';
import { IEditModelStoreOptions, useUpdateModelStore } from '@/common';
import { useProfileStore } from '@/profiles/stores/profile.store';
import { getContentTypeOptions } from '../services';
import { ModalCreate } from '../interfaces';
import { StoreStatusPlugin } from '@/core';
import { useContentStore } from '../stores';

export const ContentEditModalEmits = ['update:modelValue', 'success', 'cancel'];
type TContentEditModalEmits = 'update:modelValue' | 'success';

export function useContentEditModal<
  TModel extends ContentModel & IEditableModel<TUpdateModel>,
  TCreateModel extends CreateContentModel,
  TUpdateModel extends Partial<TCreateModel> = Partial<TCreateModel>,
  TResponse extends ContentUpdateResponse<TModel> = ContentUpdateResponse<TModel>,
>(
  props: IEditOrCreateModalProps<TModel>,
  emit: (emit: TContentEditModalEmits, val?: any) => void,
  options: IEditModelStoreOptions<TModel, TCreateModel, TUpdateModel, TResponse>,
) {
  const { content, type } = props;
  const contentStore = useContentStore();

  const showModal = computed({
    get: () => props.modelValue,
    set: (val: boolean) => emit('update:modelValue', val),
  });

  const originalOnSubmitSuccess = options.onSubmitSuccess;
  options.onSubmitSuccess = (response?: TResponse) => {
    if (isCreate.value) {
      contentStore.handleCreateContent(response);
    } else {
      contentStore.handleUpdateContent(response);
    }

    // This needs to be called before we hide the modal, otherwise dependent stores may be reset or handlers are rejected
    emit('success', response);

    showModal.value = false;

    if (originalOnSubmitSuccess) originalOnSubmitSuccess(response);
  };

  const updateStore = useUpdateModelStore<TResponse, TCreateModel, TUpdateModel>(options);

  if (content) {
    const editModel = content.toEditModel();
    editModel.tagNames = useProfileStore().tagIdsToNames(content.tagIds);
    updateStore.setEditModel(content.id, editModel);
  } else {
    const CreateType = (<ModalCreate>getContentTypeOptions(type)?.interfaces?.create)?.modelClass;

    if (!CreateType) {
      throw new Error(`Content type ${type} is missing a create model class definition`);
    }

    debugger;
    const createModel = new CreateType(props.initOptions) as TUpdateModel;
    updateStore.setCreateModel(createModel);
  }

  const {
    model,
    validator,
    status,
    isCreate,
  }: {
    model: Ref<TCreateModel | TUpdateModel>;
    validator: Ref<ModelValidator<TCreateModel | TUpdateModel>>;
    status: StoreStatusPlugin;
    isCreate: Ref<boolean>;
  } = updateStore;
  const { submit, reset } = updateStore;

  function addTag(newTag: string) {
    if (model.value) {
      model.value.tagNames ||= [];
      model.value.tagNames.push(newTag);
    }
  }

  return {
    showModal,
    model,
    isCreate,
    validator,
    addTag,
    status: ref(status),
    submit,
    reset,
  };
}
