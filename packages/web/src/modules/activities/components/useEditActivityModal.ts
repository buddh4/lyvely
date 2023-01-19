import { computed, toRefs } from 'vue';
import {
  ActivityModel,
  ActivityType,
  CalendarIntervalEnum,
  CreateHabitModel,
  CreateTaskModel,
  getCalendarPlanOptions,
  getCreateModelByActivityType,
  HabitModel,
  isTask,
  TaskModel,
  UpdateHabitModel,
  UpdateHabitResponse,
  UpdateTaskModel,
  UpdateTaskResponse,
} from '@lyvely/common';
import {
  ICreateContentModalProps,
  IEditContentModalProps,
} from '@/modules/content/interfaces/edit-content-modal-props.interface';
import { useHabitsService } from '@/modules/activities/services/habits.service';
import { useTasksService } from '@/modules/activities/services/tasks.service';
import { useUpdateModelStore } from '@/modules/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useTaskPlanStore } from '@/modules/activities/store/task-plan.store';
import { useHabitPlanStore } from '@/modules/activities/store/habit-plan.store';

type CreateModel = CreateTaskModel | CreateHabitModel;
type UpdateModel = UpdateTaskModel | UpdateHabitModel;
type UpdateActivityResponse = UpdateTaskResponse & UpdateHabitResponse;

export default function (
  props: ICreateContentModalProps & IEditContentModalProps<HabitModel | TaskModel>,
) {
  const habitsService = useHabitsService();
  const tasksService = useTasksService();

  const { content, type, initOptions } = props;

  const updateStore = useUpdateModelStore<UpdateActivityResponse, CreateModel, UpdateModel>({
    service: <any>(
      ((editModel: CreateModel) =>
        editModel instanceof CreateTaskModel ? tasksService : habitsService)
    ),
    onSubmitSuccess(response?: UpdateActivityResponse) {
      if (response) {
        useProfileStore().updateTags(response.tags);
        if (isTask(response.model)) {
          useTaskPlanStore().addTask(response.model);
        } else {
          useHabitPlanStore().addHabit(response.model);
        }
      }
    },
  });

  if (content) {
    const model = content.getEditDto();
    model.tagNames = useProfileStore()
      .getTags()
      .filter((tag) => content.tagIds.includes(tag.id))
      .map((tag) => tag.name);
    updateStore.setEditModel(content.id, model as CreateModel);
  } else {
    const model = getCreateModelByActivityType(type as ActivityType);
    model.interval = initOptions.interval || CalendarIntervalEnum.Daily;
    updateStore.setCreateModel(model as CreateModel);
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
