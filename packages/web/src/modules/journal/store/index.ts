import { defineStore } from 'pinia';
import { Status, useStatus } from '@/store/status';
import {
  EditJournalDto,
  IJournal, IJournalLog,
  JournalDto,
  JournalFilter,
  JournalLogDto,
  JournalLogStore,

  CalendarIntervalEnum,
  formatDate,
  getTimingIdsByRange,
  LoadedTimingIdStore
} from '@lyvely/common';
import { useCalendarPlanStore } from '@/modules/calendar/store';
import { useProfileStore } from '@/modules/profile/stores/profile.store';
import journalRepository from '@/modules/journal/repositories/journal.repository';

type UpdateLogEvent = { log: IJournalLog; value: number; text: string };

export const useJournalStore = defineStore('journal', {
  state: () => ({
    status: Status.INIT,
    store: new JournalLogStore(),
    calendarPlanStore: new LoadedTimingIdStore(),
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
      const calendarPlanStore = useCalendarPlanStore();
      const datesToBeLoaded = this.calendarPlanStore.getDataPointIntervalFilter(calendarPlanStore.date, profileStore.locale);

      if(!datesToBeLoaded) {
        this.setStatus(Status.SUCCESS);
        return;
      }

      const needToLoadCurrentDate = this.calendarPlanStore.getDataPointIntervalFilter(calendarPlanStore.date, profileStore.locale, 1);

      if(needToLoadCurrentDate) {
        this.setStatus(Status.LOADING);
      }

      try {
        const {data: {journals, logs}} = await journalRepository.getByRange(datesToBeLoaded);
        journals.forEach(journal => this.addJournal(journal));
        logs.forEach(log => this.addLog(log));
        this.calendarPlanStore.addLoadedTimingIds(getTimingIdsByRange(datesToBeLoaded))
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
      const calendarPlanStore = calendarPlanStore();
      const {log, value, text} = update;
      const { data: updateResult } = await journalRepository.updateLog(log.cid, {
        date: formatDate(calendarPlanStore.date),
        value,
        text
      });
      // We do not reset text values since this could interfere with current journal writing
      log.value = updateResult.value;
    },
    addJournal(journal: IJournal) {
      this.store.addModel(new JournalDto(journal));
    },
    addDataPoint(log: IJournalLog) {
      this.store.addLog(new JournalLogDto(log));
    },
    ...useStatus()
  }
})
