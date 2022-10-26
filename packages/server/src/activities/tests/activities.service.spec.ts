import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { ActivitiesService } from '../services/activities.service';
import { Model } from 'mongoose';
import { Habit, HabitDataPointDocument, UserDone } from '../schemas';
import { HabitDataPointService } from '../services/habit-data-point.service';
import { ActivityTestDataUtil, createActivityTestingModule } from './utils/activities.test.utils';
import { ActivitiesDao } from '../daos/activities.dao';
import { DataPointIntervalFilter, sortActivities, CalendarIntervalEnum } from '@lyvely/common';
import { Profile } from '@/profiles';
import { assureStringId } from '@/core';
import { User } from '@/users';
import { HabitDataPointDao } from '../daos/habit-data-point.dao';
import { ContentDocument, ContentScoreService, ContentScoreDao } from '@/content';

describe('ActivityService', () => {
  let testingModule: TestingModule;
  let ContentModel: Model<ContentDocument>;
  let HabitDataPointModel: Model<HabitDataPointDocument>;
  let testData: ActivityTestDataUtil;
  let activitiesService: ActivitiesService;

  const TEST_KEY = 'activities_service';

  beforeEach(async () => {
    testingModule = await createActivityTestingModule(TEST_KEY, [
      ActivitiesDao,
      ActivitiesService,
      HabitDataPointService,
      HabitDataPointDao,
      ContentScoreService,
      ContentScoreDao,
    ]).compile();
    ContentModel = testingModule.get<Model<ContentDocument>>('ContentModel');
    HabitDataPointModel = testingModule.get<Model<HabitDataPointDocument>>('HabitDataPointModel');
    activitiesService = testingModule.get<ActivitiesService>(ActivitiesService);
    testData = testingModule.get<ActivityTestDataUtil>(ActivityTestDataUtil);
  });

  afterEach(async () => {
    await ContentModel.deleteMany({});
    await HabitDataPointModel.deleteMany({});
    await testData.reset(TEST_KEY);
  });

  describe('sort', () => {
    const createHabits = async (user: User, profile: Profile) => {
      return [
        await testData.createHabit(user, profile, { title: 'h0' }, (model) => {
          model.meta.sortOrder = 0;
        }),
        await testData.createHabit(user, profile, { title: 'h1' }, (model) => {
          model.meta.sortOrder = 1;
        }),
        await testData.createHabit(user, profile, { title: 'h2' }, (model) => {
          model.meta.sortOrder = 2;
        }),
        await testData.createHabit(user, profile, { title: 'h3' }, (model) => {
          model.meta.sortOrder = 3;
        }),
        await testData.createHabit(user, profile, { title: 'h4' }, (model) => {
          model.meta.sortOrder = 4;
        }),
      ];
    };

    it('sort to top', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      const habits = await createHabits(user, profile);

      await activitiesService.sort(profile, user, habits[3], habits[3].dataPointConfig.interval);

      const filter = new DataPointIntervalFilter(ActivityTestDataUtil.getDateTomorrow());
      const { activities } = await activitiesService.findByFilter(profile, user, filter);
      sortActivities(activities);
      expect(activities.length).toEqual(5);
      expect(activities[0].data.title).toEqual('h3');
      expect(activities[1].data.title).toEqual('h0');
      expect(activities[2].data.title).toEqual('h1');
      expect(activities[3].data.title).toEqual('h2');
      expect(activities[4].data.title).toEqual('h4');
    });

    it('sort to bottom', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habits = await createHabits(user, profile);

      await activitiesService.sort(profile, user, habits[1], habits[1].dataPointConfig.interval, habits[4]);

      const filter = new DataPointIntervalFilter(ActivityTestDataUtil.getDateTomorrow());
      const { activities } = await activitiesService.findByFilter(profile, user, filter);
      sortActivities(activities);
      expect(activities.length).toEqual(5);
      expect(activities[0].data.title).toEqual('h0');
      expect(activities[1].data.title).toEqual('h2');
      expect(activities[2].data.title).toEqual('h3');
      expect(activities[3].data.title).toEqual('h4');
      expect(activities[4].data.title).toEqual('h1');
    });

    it('sort to same index', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habits = await createHabits(user, profile);

      await activitiesService.sort(profile, user, habits[2], habits[2].dataPointConfig.interval, habits[2]);

      const filter = new DataPointIntervalFilter(ActivityTestDataUtil.getDateTomorrow());
      const { activities } = await activitiesService.findByFilter(profile, user, filter);
      sortActivities(activities);
      expect(activities.length).toEqual(5);
      expect(activities[0].data.title).toEqual('h0');
      expect(activities[1].data.title).toEqual('h1');
      expect(activities[2].data.title).toEqual('h2');
      expect(activities[3].data.title).toEqual('h3');
      expect(activities[4].data.title).toEqual('h4');
    });

    it('sort to another interval', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habits = [
        await testData.createHabit(user, profile, { title: 'h0', interval: CalendarIntervalEnum.Daily }, (model) => {
          model.meta.sortOrder = 0;
        }),
        await testData.createHabit(user, profile, { title: 'h1', interval: CalendarIntervalEnum.Daily }, (model) => {
          model.meta.sortOrder = 1;
        }),
        await testData.createHabit(user, profile, { title: 'h2', interval: CalendarIntervalEnum.Weekly }, (model) => {
          model.meta.sortOrder = 0;
        }),
        await testData.createHabit(user, profile, { title: 'h3', interval: CalendarIntervalEnum.Weekly }, (model) => {
          model.meta.sortOrder = 1;
        }),
        await testData.createHabit(user, profile, { title: 'h4', interval: CalendarIntervalEnum.Weekly }, (model) => {
          model.meta.sortOrder = 2;
        }),
      ];

      await activitiesService.sort(profile, user, habits[0], habits[2].dataPointConfig.interval, habits[2]);
      expect(habits[0].dataPointConfig.interval).toEqual(CalendarIntervalEnum.Weekly);
      expect(habits[0].dataPointConfig.history.length).toEqual(1);
      expect(habits[0].dataPointConfig.history[0].interval).toEqual(CalendarIntervalEnum.Daily);

      expect(habits[0].meta.sortOrder).toEqual(1);
      const h2 = await activitiesService.findByProfileAndId(profile, habits[2]);
      expect(h2.meta.sortOrder).toEqual(0);
      const h3 = await activitiesService.findByProfileAndId(profile, habits[3]);
      expect(h3.meta.sortOrder).toEqual(2);
      const h4 = await activitiesService.findByProfileAndId(profile, habits[4]);
      expect(h4.meta.sortOrder).toEqual(3);
    });
  });

  describe('Activities service', () => {
    describe('findByRangeFilter', () => {
      it('find undone task', async () => {
        const { user, profile } = await testData.createUserAndProfile('user1');
        const task = await testData.createTask(user, profile);
        const filter = new DataPointIntervalFilter(new Date());
        const { activities } = await activitiesService.findByFilter(profile, user, filter);
        expect(activities.length).toEqual(1);
        expect(activities[0].id).toEqual(task.id);
      });

      it('find task done today within filter range', async () => {
        const { user, profile } = await testData.createUserAndProfile('user1');
        const task = await testData.createTask(user, profile, { title: 't1' }, (model) => {
          model.doneBy = [new UserDone(user, ActivityTestDataUtil.getTodayTimingId())];
        });
        const filter = new DataPointIntervalFilter(new Date());
        const { activities } = await activitiesService.findByFilter(profile, user, filter);
        expect(activities.length).toEqual(1);
        expect(activities[0].id).toEqual(task.id);
      });

      it('find task done tomorrow within filter range', async () => {
        const { user, profile } = await testData.createUserAndProfile('user1');
        const task = await testData.createTask(user, profile, { title: 't1' }, (model) => {
          model.doneBy = [new UserDone(user, ActivityTestDataUtil.getTomorrowTimingId())];
        });
        const filter = new DataPointIntervalFilter(ActivityTestDataUtil.getDateTomorrow());
        const { activities } = await activitiesService.findByFilter(profile, user, filter);
        expect(activities.length).toEqual(1);
        expect(activities[0].id).toEqual(task.id);
      });

      it('do not include tasks done outside of filter range', async () => {
        const { user, profile } = await testData.createUserAndProfile('user1');
        await testData.createTask(user, profile, { title: 't1' }, (model) => {
          model.doneBy = [new UserDone(user, ActivityTestDataUtil.getTomorrowTimingId())];
        });
        const filter = new DataPointIntervalFilter(new Date());
        const { activities } = await activitiesService.findByFilter(profile, user, filter);
        expect(activities.length).toEqual(0);
      });

      it('find habit', async () => {
        const { user, profile } = await testData.createUserAndProfile('user1');
        const habit = await testData.createHabit(user, profile);
        const filter = new DataPointIntervalFilter('2021-01-01');
        const { activities } = await activitiesService.findByFilter(profile, user, filter);
        expect(activities.length).toEqual(1);
        expect(activities[0].id).toEqual(habit.id);
      });

      it('find habit log within filter range', async () => {
        const { user, profile } = await testData.createUserAndProfile('user1');
        const habit = await testData.createHabit(user, profile);
        const log = await testData.createLog(user, profile, habit, new Date());
        const filter = new DataPointIntervalFilter(new Date());
        const { dataPoints } = await activitiesService.findByFilter(profile, user, filter);
        expect(dataPoints.length).toEqual(1);
        expect(dataPoints[0].id).toEqual(log.id);
      });

      it('do not find habit log outside of filter range', async () => {
        const { user, profile } = await testData.createUserAndProfile('user1');
        const habit = await testData.createHabit(user, profile);
        await testData.createLog(user, profile, habit, ActivityTestDataUtil.getDateTomorrow());
        const filter = new DataPointIntervalFilter(ActivityTestDataUtil.getDateYesterday());
        const { dataPoints } = await activitiesService.findByFilter(profile, user, filter);
        expect(dataPoints.length).toEqual(0);
      });
    });

    describe('findByRangeFilter', () => {
      it('find activity by profile and ObjectId', async () => {
        const { user, profile } = await testData.createUserAndProfile('user1');
        const habit = await testData.createHabit(user, profile);
        const search = await activitiesService.findByProfileAndId(profile, habit._id);
        expect(search).toBeDefined();
        expect(search.id).toEqual(habit.id);
      });

      it('find activity by profile and string id', async () => {
        const { user, profile } = await testData.createUserAndProfile('user1');
        const habit = await testData.createHabit(user, profile);
        const search = await activitiesService.findByProfileAndId(profile, assureStringId(habit._id));
        expect(search).toBeDefined();
        expect(search.id).toEqual(habit.id);
      });

      it('do not find activity of another profile', async () => {
        const { user, profile } = await testData.createUserAndProfile('user1');
        const profile2 = await testData.createProfile(user, 'profile2');
        const habit = await testData.createHabit(user, profile);
        const search = await activitiesService.findByProfileAndId(profile2, assureStringId(habit._id));
        expect(search).toBeNull();
      });
    });

    describe('archive', () => {
      it('owner can archive habit', async () => {
        const { user, profile, profileRelations } = await testData.createUserAndProfile();
        const habit = await testData.createHabit(user, profile);
        const archived = await activitiesService.archive(profileRelations, habit);
        expect(archived).toEqual(true);
        expect(habit.meta.isArchived).toEqual(true);
        const updated = await activitiesService.findByProfileAndId(profile, habit);
        expect(updated.meta.isArchived).toEqual(true);
      });
    });

    describe('unarchive', () => {
      it('owner can un-archive habit', async () => {
        const { user, profile, profileRelations } = await testData.createUserAndProfile();
        const habit = await testData.createHabit(user, profile, { title: 't1' }, (model: Habit) => {
          model.meta.isArchived = true;
        });
        expect(habit.meta.isArchived).toEqual(true);

        const unarchived = await activitiesService.unarchive(profileRelations, habit);
        expect(unarchived).toEqual(true);
        expect(habit.meta.isArchived).toEqual(false);
        const updated = await activitiesService.findByProfileAndId(profile, habit);
        expect(updated.meta.isArchived).toEqual(false);
      });
    });
  });
});
