import { defineStore } from 'pinia';
import { ActivityType, getCreateModelByActivityType, EditHabitDto,
  EditTaskDto, getEditModelByActivity, IActivity, ModelValidator,
  CalendarIntervalEnum   } from '@lyvely/common';
import habitsRepository from '@/modules/activity/repositories/habits.repository';
import tasksRepository from '@/modules/activity/repositories/tasks.repository';
import { DialogExceptionHandler } from '@/modules/core/handler/exception.handler';
import { useTaskPlanStore } from "@/modules/activity/store/taskPlanStore";
import { useHabitPlanStore } from "@/modules/activity/store/habitPlanStore";
import { ref, computed, Ref} from 'vue';

export const useActivityEditStore = defineStore('activityEdit', () => {
  const model = ref(undefined) as Ref<EditHabitDto|EditTaskDto|undefined>;
  const modelId = ref(undefined) as Ref<string|undefined>;
  const validator = ref(undefined) as Ref<ModelValidator|undefined>;
  const showModal = ref(false);
  const isCreate = ref(false);

  const modalTitle = computed(() => (model.value instanceof EditTaskDto)
    ? (isCreate.value) ? "Add task" : "Edit task"
    : (isCreate.value) ? "Add activity" : "Edit activity")

  function setEditActivity(activity: IActivity) {
    isCreate.value = false;
    _setModel(getEditModelByActivity(activity), activity.id);
  }

  function setCreateActivity(type: ActivityType, interval = CalendarIntervalEnum.Daily) {
    isCreate.value = true;
    const model = getCreateModelByActivityType(type);
    model.interval = interval;
    _setModel(model);
  }

  function _setModel(newModel?: EditHabitDto|EditTaskDto, cid = undefined as undefined|string) {
    if(newModel) {
      model.value = newModel;
      modelId.value = cid;
      validator.value = new ModelValidator(model);
      showModal.value = true;
    } else {
      model.value = undefined;
      modelId.value = undefined;
      validator.value = undefined;
      showModal.value = false;
    }
  }

  function reset() {
    _setModel(undefined);
  }

  async function submit() {
    if (!validator.value || !await validator.value.validate()) {
      return;
    }

    return isCreate.value ? await _createActivity() : await _editActivity();
  }

  function getError(field: string) {
    return validator?.value?.getError(field);
  }

  async function _createActivity() {
    const modelInstance = model.value;
    try {
      if (modelInstance instanceof EditTaskDto) {
        useTaskPlanStore().addTask((await tasksRepository.create(modelInstance)).data);
      } else if(modelInstance instanceof EditHabitDto) {
        useHabitPlanStore().addHabit((await habitsRepository.create(modelInstance)).data);
      }
    } catch(err) {
      DialogExceptionHandler('An unexpected error occurred while editing the activity', this)(err);
    } finally {
      reset()
    }
  }

  async function _editActivity() {
    const cid = modelId.value;
    const modelInstance = model.value;

    if(!cid || !modelInstance) {
      console.assert(typeof cid === 'undefined', 'Can not edit activity without given modelId.');
      console.assert(typeof modelInstance === 'undefined', 'Can not edit activity without model instance.');
      return;
    }

    try {
      if (modelInstance instanceof EditTaskDto) {
        useTaskPlanStore().addTask((await tasksRepository.update(cid, modelInstance)).data);
      } else {
        useHabitPlanStore().addHabit((await habitsRepository.update(cid, modelInstance)).data);
      }
    } catch(err) {
      DialogExceptionHandler('An unexpected error occurred while creating the activity', this)(err);
    } finally {
      reset();
    }
  }

  return {
    model,
    modelId,
    validator,
    showModal,
    isCreate,
    modalTitle,
    setEditActivity,
    setCreateActivity,
    submit,
    getError,
    reset
  }
});
