import { computed, toRefs } from 'vue';
import {
  ContentModel,
  getCalendarPlanOptions,
  ICrudModel,
  CreateContentModel,
  ContentUpdateResponse,
} from '@lyvely/common';
import {
  ICreateContentModalProps,
  IEditContentModalProps,
} from '@/modules/content/interfaces/edit-content-modal-props.interface';
import { IEditModelStoreOptions, useUpdateModelStore } from '@/modules/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { eventBus } from '@/modules/core/events/global.emitter';
import { getContentTypeOptions } from '@/modules/content-stream/components/content-stream-entry.registry';
import { ModalCreate } from '@/modules/content-stream/interfaces/stream-entry-registration.interface';

export function useContentEditModal<
  TModel extends ContentModel & ICrudModel<TUpdateModel>,
  TCreateModel extends CreateContentModel,
  TUpdateModel extends Partial<CreateContentModel> = Partial<TCreateModel>,
  TResponse extends ContentUpdateResponse<TModel> = ContentUpdateResponse<TModel>,
>(
  props: ICreateContentModalProps & IEditContentModalProps<TModel>,
  options: IEditModelStoreOptions<TModel, TCreateModel, TUpdateModel, TResponse>,
) {
  const { content, type } = props;

  const originalOnSubmitSuccess = options.onSubmitSuccess;
  options.onSubmitSuccess = (response?: TResponse) => {
    if (response) {
      useProfileStore().updateTags(response.tags);
      if (isCreate.value) {
        eventBus.emit(`content.${response.model.type}.create.post`, response);
      } else {
        eventBus.emit(`content.${response.model.type}.update.post`, response);
      }
    }

    if (originalOnSubmitSuccess) originalOnSubmitSuccess(response);
  };

  const updateStore = useUpdateModelStore<TResponse, TCreateModel, TUpdateModel>(options);

  if (content) {
    const model = content.toEditModel();
    model.tagNames = useProfileStore()
      .getTags()
      .filter((tag) => content.tagIds.includes(tag.id))
      .map((tag) => tag.name);
    updateStore.setEditModel(content.id, model as TUpdateModel);
  } else {
    const CreateType = (<ModalCreate>getContentTypeOptions(type)?.create).modelType;
    const model = new CreateType(props.initOptions) as TUpdateModel;
    updateStore.setCreateModel(model);
  }

  const { model, validator, status, isCreate } = toRefs(updateStore);
  const { submit, reset } = updateStore;

  function addTag(newTag: string) {
    if (model?.value?.tagNames) {
      model?.value.tagNames.push(newTag);
    }
  }

  return {
    model,
    isCreate,
    validator,
    addTag,
    status,
    submit,
    reset,
    calendarPlanOptions: computed(() => getCalendarPlanOptions()),
  };
}
