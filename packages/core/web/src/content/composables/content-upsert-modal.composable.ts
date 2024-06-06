import { computed, ref, Ref } from 'vue';
import {
  IEditableModel,
  ContentModel,
  CreateContentModel,
  ContentUpdateResponse,
} from '@lyvely/interface';
import { IEditOrCreateModalProps } from '@/content/interfaces/edit-content-modal-props.interface';
import { IUpdateModelStoreOptions, useUpsertModelStore } from '@/common';
import { useProfileStore } from '@/profiles/stores/profile.store';
import { getContentCreateModel } from '../registries';
import { StoreStatusPlugin } from '@/core';
import { useContentStore } from '../stores';
import { I18nModelValidator } from '@/i18n';

export const ContentEditModalEmits = ['update:modelValue', 'success', 'cancel'];
type TContentEditModalEmits = 'update:modelValue' | 'success';

export function useContentUpsertModal<
  TModel extends ContentModel & IEditableModel<TUpdateModel>,
  TCreateModel extends CreateContentModel,
  TUpdateModel extends Partial<TCreateModel> = Partial<TCreateModel>,
  TResponse extends ContentUpdateResponse<TModel> = ContentUpdateResponse<TModel>,
>(
  props: IEditOrCreateModalProps<TModel>,
  emit: (emit: TContentEditModalEmits, val?: any) => void,
  options: IUpdateModelStoreOptions<TModel, TCreateModel, TUpdateModel, TResponse>
) {
  const { content, initOptions, modelValue, type } = props;
  const contentStore = useContentStore();

  const showModal = computed({
    get: () => modelValue,
    set: (val: boolean) => {
      emit('update:modelValue', val);
      if (!val) updateStore.reset();
    },
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

  const updateStore = useUpsertModelStore<TResponse, TCreateModel, TUpdateModel>(options);

  if (content) {
    const editModel = content.toEditModel();
    editModel.tagNames = useProfileStore().tagIdsToNames(content.tagIds);
    updateStore.setUpdateModel(content.id, editModel);
  } else {
    const CreateType = getContentCreateModel(type);

    if (!CreateType) {
      throw new Error(`Content type ${type} is missing a create model class definition`);
    }

    const createModel = new CreateType(initOptions) as TCreateModel;
    updateStore.setCreateModel(createModel);
  }

  const {
    model,
    validator,
    status,
    isCreate,
  }: {
    model: Ref<TCreateModel | TUpdateModel>;
    validator: I18nModelValidator<TCreateModel | TUpdateModel>;
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
