import { defineStore } from 'pinia';
import { ActivityType, getCreateModelByActivityType, EditHabitDto,
  EditTaskDto, getEditModelByActivity, IActivity, ModelValidator} from 'lyvely-common';
import habitsRepository from '@/modules/activity/repositories/habits.repository';
import tasksRepository from '@/modules/activity/repositories/tasks.repository';
import { useActivityStore } from '@/modules/activity/store/activityStore';
import { DialogExceptionHandler } from '@/modules/core/handler/exception.handler';

export const useActivityEditStore = defineStore('activityEdit', {
  state: () => ({
    model: undefined as EditTaskDto | EditHabitDto | undefined,
    modelId: undefined as string | undefined,
    validator: undefined as ModelValidator | undefined,
    isCreate: false,
  }),
  getters: {
    showModal: (state) => !!state.model,
    modalTitle: (state) => {
      return (state.model instanceof EditTaskDto)
        ? (state.isCreate) ? "Add task" : "Edit task"
        : (state.isCreate) ? "Add activity" : "Edit activity";
    }
  },
  actions: {
    setEditActivity(model: IActivity) {
      this.isCreate = false;
      this.model = getEditModelByActivity(model);
      this.modelId = model.id;
      this.validator = new ModelValidator(this.model);
    },
    setCreateActivity(type: ActivityType) {
      this.isCreate = true;
      this.model = getCreateModelByActivityType(type);
      this.validator = new ModelValidator(this.model);
    },
    async submit() {
      if (!await this.validator.validate()) {
        return;
      }

      if(this.isCreate) {
        await this.createActivity()
      } else {
        await this.editActivity()
      }
    },
    getError(field: string) {
      return this.validator.getError(field);
    },
    reset() {
       this.$reset();
    },
    async createActivity() {
      try {
        const activityStore = useActivityStore();
        if (this.model instanceof EditTaskDto) {
          activityStore.addTask((await tasksRepository.create(this.model)).data);
        } else {
          activityStore.addHabit((await habitsRepository.create(this.model)).data);
        }
      } catch(err) {
        DialogExceptionHandler('An unexpected error occurred while editing the activity', this)(err);
      } finally {
        this.reset()
      }
    },
    async editActivity() {
      debugger;
      if(!this.modelId) {
        console.error('Try to edit activity without given modelId');
        return false;
      }

      const activityStore = useActivityStore();

      try {
        if (this.model instanceof EditTaskDto) {
          activityStore.addTask((await tasksRepository.update(this.model)).data);
        } else {
          activityStore.addHabit((await habitsRepository.update(this.modelId, this.model)).data);
        }
      } catch(err) {
        DialogExceptionHandler('An unexpected error occurred while creating the activity', this)(err);
      } finally {
        this.reset();
      }
    },
  }
});
