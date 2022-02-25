import { defineStore } from 'pinia';
import { Status, useStatus } from '@/store/status';
import { Membership, Profile } from 'lyvely-common';

import profileRepository from '@/modules/user/repositories/profile.repository';
import { localStorageManager } from '@/util/storage';
import { DialogExceptionHandler } from '@/modules/core/handler/exception.handler';

const DEFAULT_PROFILE_KEY = 'default_profile';

export const latestProfileId = localStorageManager.getStoredValue(DEFAULT_PROFILE_KEY);

export const useProfileStore = defineStore('profile', {
  state: () => ({
    status: Status.INIT,
    profile: undefined as Profile | undefined,
    membership: undefined as Membership | undefined,
    profiles: new Array<Profile>(),
  }),
  getters: {
    locale: (state) => state.profile?.locale || 'de',
    categoryOptions: (state) => state.profile?.categories?.map((category) => category.name) || []
  },
  actions: {
    async loadProfile(id?: string|null) {
      this.status = Status.LOADING;
      id = id || latestProfileId.getValue();

      if(this.profile?.id === id) {
        return Promise.resolve(this.profile);
      }

      try {
        const { data: { profile } } = await profileRepository.getProfile(id);
        await this.setActiveProfile(profile);
      } catch (err) {
        const { data: { profile } } = await profileRepository.getDefaultProfile();
        await this.setActiveProfile(profile);
        DialogExceptionHandler('Profile could not be loaded...', this)(err);
      }

      return this.profile;
    },
    async setActiveProfile(profile: Profile) {
      this.profile = profile;
      latestProfileId.setValue(profile.id);
      this.setStatus(Status.SUCCESS);
    },
    updateScore(value: number) {
      if(this.profile) {
        this.profile.score = value;
      }
    },
    async updateProfileCategories() {
      try {
        if(this.profile) {
          const { data: { categories } } = await profileRepository.getCategories(this.profile.name);
          this.profile.categories = categories;
        }
      } catch(e) {
        // TODO: Implement
      }
    },
    ...useStatus()
  }
})

