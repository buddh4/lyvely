import { defineStore } from 'pinia';
import { Status, useStatus } from '@/store/status';
import { RegisterDto, ModelValidator } from 'lyvely-common';
import registerRepository from '../repositories/register.repository';

export const useRegisterStore = defineStore('register', {
  state: () => ({
    status: Status.INIT,
    model: new RegisterDto(),
    errorMsg: '',
    validator: new ModelValidator(),
  }),
  actions: {
    async register() {
      this.validator.setModel(this.model);

      if (!await this.validator.validate()) {
        return;
      }

      this.setStatus(Status.LOADING);
      try {
        await registerRepository.register(this.model);
        this.errorMsg = '';
        this.setStatus(Status.SUCCESS);
      } catch(e: any) {
        this.errorMsg = e?.response?.data?.message || e.message;
        this.setStatus(Status.ERROR);
      }
    },
    getError(field: string) {
      return this.validator.getError(field);
    },
    ...useStatus()
  }
});
