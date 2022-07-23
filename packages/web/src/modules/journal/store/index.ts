import { defineStore } from 'pinia';
import { Status, useStatus } from '@/store/status';
import {
  EditJournalDto,
  IJournal, IJournalLog,
  JournalDto,
  JournalFilter,
  JournalLogDto,
  JournalLogStore,
} from 'lyvely-common';
import {
  CalendarIntervalEnum,
  formatDate,
  getTimingIdsByRange,
  LoadedTimingIdStore
} from 'lyvely-common';
import { useTimingStore } from '@/modules/timing/store';
import { useProfileStore } from '@/modules/user/store/profile.store';
import journalRepository from '@/modules/journal/repositories/journal.repository';

type UpdateLogEvent = { log: IJournalLog; value: number; text: string };

export const useJournalStore = defineStore('journal', {
  state: () => ({
    status: Status.INIT,
    store: new JournalLogStore(),
    timingStore: new LoadedTimingIdStore(),
    filter: new JournalFilter(),
    dragActive: false
  }),
  getters: {
    journals: (state) => (plan: CalendarIntervalEnum) =>
      state.store.filterModels((journal: IJournal) => journal.interval === plan && (!state.filter || state.filter.run(journal)))
  },
  actions: {
    async loadJournals() {
      const profileStore = useProfileStore();
      const timingStore = useTimingStore();
      const datesToBeLoaded = this.timingStore.getDataPointIntervalFilter(timingStore.date, profileStore.locale);

      if(!datesToBeLoaded) {
        this.setStatus(Status.SUCCESS);
        return;
      }

      const needToLoadCurrentDate = this.timingStore.getDataPointIntervalFilter(timingStore.date, profileStore.locale, 1);

      if(needToLoadCurrentDate) {
        this.setStatus(Status.LOADING);
      }

      try {
        const {data: {journals, logs}} = await journalRepository.getByRange(datesToBeLoaded);
        journals.forEach(journal => this.addJournal(journal));
        logs.forEach(log => this.addLog(log));
        this.timingStore.addLoadedTimingIds(getTimingIdsByRange(datesToBeLoaded))
        this.setStatus(Status.SUCCESS);
      } catch(e) {
        // TODO: Implement
      }
    },
    async createJournal(model: EditJournalDto) {
      try {
        const { data } = await journalRepository.create(model);
        this.addJournal(data);
      } catch(e) {
        // TODO: Implement
      }
    },
    async updateLog(update: UpdateLogEvent) {
      const timingStore = useTimingStore();
      const {log, value, text} = update;
      const { data: updateResult } = await journalRepository.updateLog(log.cid, {
        date: formatDate(timingStore.date),
        value,
        text
      });
      // We do not reset text values since this could interfere with current journal writing
      log.value = updateResult.value;
    },
    addJournal(journal: IJournal) {
      this.store.addModel(new JournalDto(journal));
    },
    addLog(log: IJournalLog) {
      this.store.addLog(new JournalLogDto(log));
    },
    ...useStatus()
  }
})
