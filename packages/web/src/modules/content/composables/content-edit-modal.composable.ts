import { computed, ref, Ref } from 'vue';
import {
  ContentModel,
  IEditableModel,
  CreateContentModel,
  ContentUpdateResponse,
  ModelValidator,
} from '@lyvely/common';
import { IEditOrCreateModalProps } from '@/modules/content/interfaces/edit-content-modal-props.interface';
import { IEditModelStoreOptions, useUpdateModelStore } from '@/modules/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { getContentTypeOptions } from '@/modules/content-stream/components/content-stream-entry.registry';
import { ModalCreate } from '@/modules/content-stream/interfaces/stream-entry-registration.interface';
import { StoreStatusPlugin } from '@/store';
import { useContentStore } from '@/modules/content/stores/content.store';

export function useContentEditModal<
  TModel extends ContentModel & IEditableModel<TUpdateModel>,
  TCreateModel extends CreateContentModel,
  TUpdateModel extends Partial<TCreateModel> = Partial<TCreateModel>,
  TResponse extends ContentUpdateResponse<TModel> = ContentUpdateResponse<TModel>,
>(
  props: IEditOrCreateModalProps<TModel>,
  emit: (emit: 'update:modelValue', val: boolean) => void,
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
